
export interface Household {
    id: string;
    created_at: string;
    primary_person_id: string;
    display_name?: string | null;
}

export interface HouseholdMember {
    id: string;
    household_id: string;
    first_name: string;
    last_name: string;
    relationship: "SPOUSE" | "PARTNER" | "CHILD" | "DEPENDANT" | "OTHER";
    date_of_birth?: string | null;
    lives_with_primary: boolean;
    is_dependent: boolean;
    tax_data: Record<string, unknown>;
    created_at?: string;
}
