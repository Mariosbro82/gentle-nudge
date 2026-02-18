-- Fix SSRF vulnerability in test_webhook DB function
CREATE OR REPLACE FUNCTION public.test_webhook(url text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  response extensions.http_response;
  result json;
BEGIN
  IF url IS NULL OR url = '' THEN
    RETURN json_build_object('success', false, 'error', 'URL missing');
  END IF;

  -- SSRF Protection: Must use HTTPS
  IF url !~ '^https://' THEN
    RETURN json_build_object('success', false, 'error', 'Webhook URL must use HTTPS protocol');
  END IF;

  -- SSRF Protection: Block private/internal addresses
  IF url ~* '(localhost|127\.0\.0\.1|169\.254\.|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|0\.0\.0\.0|::1|\[::1\])' THEN
    RETURN json_build_object('success', false, 'error', 'Webhook URL cannot target private/internal addresses');
  END IF;

  -- SSRF Protection: Block raw IP addresses
  IF url ~ '^https://\d+\.\d+\.\d+\.\d+' THEN
    RETURN json_build_object('success', false, 'error', 'Webhook URL must use domain names, not IP addresses');
  END IF;

  SELECT * INTO response FROM http_post(url, '{"test": true, "message": "NFCwear Webhook Test"}', 'application/json');

  IF response.status >= 200 AND response.status < 300 THEN
    result := json_build_object(
      'success', true,
      'status_code', response.status,
      'message', 'Webhook delivered successfully'
    );
  ELSE
    result := json_build_object(
      'success', false,
      'status_code', response.status,
      'error', 'Server returned error status'
    );
  END IF;

  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', 'Webhook request failed');
END;
$function$;
