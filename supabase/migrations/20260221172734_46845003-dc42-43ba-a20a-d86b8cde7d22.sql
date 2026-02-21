-- Add AI knowledge base field for employees to customize their AI assistant
ALTER TABLE public.users ADD COLUMN ai_knowledge TEXT DEFAULT NULL;

COMMENT ON COLUMN public.users.ai_knowledge IS 'Custom knowledge base text that employees can edit to feed their AI assistant with additional information, FAQs, talking points etc.';