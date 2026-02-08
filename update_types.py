import json
import os

temp_file_path = "/Users/fabianharnisch/.gemini/antigravity/brain/e3f9f4b1-655c-48ea-a152-0aab92b8da68/.system_generated/steps/46/output.txt"
target_file_path = "/Users/fabianharnisch/nfc-website/src/types/supabase.ts"

with open(temp_file_path, "r") as f:
    data = json.load(f)

types_content = data["types"]

helper_types = """
// Helper types for easier usage
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]

// Convenience types
export type User = Tables<"users">
export type Chip = Tables<"chips">
export type Company = Tables<"companies">
export type Lead = Tables<"leads">
export type Scan = Tables<"scans">
export type CampaignOverride = Tables<"campaign_overrides">
export type WebhookLog = Tables<"webhook_logs">
export type ProfileTemplate = Tables<"profile_templates">

export type ChipMode = Enums<"chip_mode">
export type PlanType = Enums<"plan_type">
export type SentimentType = Enums<"sentiment_type">
"""

final_content = types_content + "\n" + helper_types

with open(target_file_path, "w") as f:
    f.write(final_content)

print("Successfully updated supabase.ts")
