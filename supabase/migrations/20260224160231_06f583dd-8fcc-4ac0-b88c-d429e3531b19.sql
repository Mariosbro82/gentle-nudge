UPDATE public.follow_up_emails 
SET status = 'pending', error_message = NULL, sent_at = NULL, scheduled_at = now()
WHERE status = 'failed';