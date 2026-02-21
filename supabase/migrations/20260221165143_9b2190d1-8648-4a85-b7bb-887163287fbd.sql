
-- Add template_config JSONB column to organizations
ALTER TABLE public.organizations
ADD COLUMN template_config jsonb DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.organizations.template_config IS 'Corporate template configuration: global_colors, company_logo_url, mandatory_links, locked_fields';
