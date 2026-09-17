import Anthropic from '@anthropic-ai/sdk';
import { ENV } from '../config/env';
import { MedicalProfile, Patient, AITriageResponse } from '../types';

let anthropicClient: Anthropic | null = null;

if (ENV.ANTHROPIC_API_KEY) {
  try {
    anthropicClient = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY });
    console.log('✅ Anthropic Claude API client initialized.');
  } catch (err) {
    console.warn('⚠️ Anthropic client initialization failed:', err);
  }
}

export class AIService {
  /**
   * Generates instant emergency medical summary & triage level
   * Target: < 5 seconds
   */
  public static async generateTriageSummary(
    patient: Patient,
    profile: MedicalProfile,
    incidentContext?: string
  ): Promise<AITriageResponse> {
    const promptContext = `
Patient: ${patient.full_name}, Age/DOB: ${patient.date_of_birth || 'Unknown'}, Gender: ${patient.gender || 'Unknown'}
Blood Type: ${profile.blood_type}
Critical Allergies: ${profile.allergies.join(', ') || 'None reported'}
Chronic Conditions: ${profile.chronic_conditions.join(', ') || 'None'}
Current Medications: ${profile.current_medications.map(m => `${m.name} (${m.dosage}, ${m.frequency})`).join('; ') || 'None'}
Emergency Notes: ${profile.notes || 'None'}
Incident Context: ${incidentContext || 'Unconscious trauma in Golden Hour emergency response'}
    `.trim();

    // 1. If Anthropic Claude API is available
    if (anthropicClient) {
      try {
        const response = await anthropicClient.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 600,
          temperature: 0.1,
          system: `You are an expert Emergency Medicine Clinical Decision AI for paramedics and ER trauma teams.
Respond ONLY with a valid JSON object matching this exact schema:
{
  "triage_level": "Level 1 - Resuscitation" | "Level 2 - Emergent" | "Level 3 - Urgent" | "Level 4 - Less Urgent",
  "severity_color": "red" | "amber" | "yellow" | "green",
  "summary_headline": "string (one line concise medical headline, e.g. O- Blood | Diabetic Shock Risk | Severe Penicillin Allergy)",
  "critical_warnings": ["array of immediate clinical alerts"],
  "recommended_actions": ["array of prioritized paramedic/ER protocol steps"],
  "contraindicated_drugs": ["array of drugs strictly contraindicated based on allergies or current meds"]
}`,
          messages: [
            {
              role: 'user',
              content: `Analyze this emergency patient and produce immediate triage recommendations:\n${promptContext}`
            }
          ]
        });

        const textContent = response.content[0]?.type === 'text' ? response.content[0].text : '';
        const parsed = JSON.parse(textContent) as AITriageResponse;
        parsed.generated_at = new Date().toISOString();
        return parsed;
      } catch (err) {
        console.warn('Claude API request failed or returned invalid JSON. Engaging clinical fallback engine:', err);
      }
    }

    // 2. Clinical Emergency Rule-based Engine (Guaranteed zero latency & zero downtime)
    return this.generateClinicalRuleFallback(patient, profile, incidentContext);
  }

  private static generateClinicalRuleFallback(
    patient: Patient,
    profile: MedicalProfile,
    incidentContext?: string
  ): AITriageResponse {
    const isCriticalBlood = profile.blood_type === 'O-' || profile.blood_type === 'AB-';
    const hasSevereAllergies = profile.allergies.some(a =>
      /penicillin|amoxicillin|latex|anaphylaxis|aspirin|peanuts/i.test(a)
    );
    const hasCardiacRisk = profile.chronic_conditions.some(c =>
      /pacemaker|cardiac|fibrillation|hypertension/i.test(c)
    );
    const hasDiabetes = profile.chronic_conditions.some(c => /diabet/i.test(c));

    let triage_level: AITriageResponse['triage_level'] = 'Level 3 - Urgent';
    let severity_color: AITriageResponse['severity_color'] = 'yellow';

    if (hasCardiacRisk && profile.allergies.length > 1) {
      triage_level = 'Level 1 - Resuscitation';
      severity_color = 'red';
    } else if (hasSevereAllergies || hasDiabetes || isCriticalBlood) {
      triage_level = 'Level 2 - Emergent';
      severity_color = 'amber';
    }

    const contraindicated: string[] = [];
    if (profile.allergies.some(a => /penicillin/i.test(a))) {
      contraindicated.push('Penicillin-class antibiotics', 'Amoxicillin', 'Ampicillin');
    }
    if (profile.allergies.some(a => /aspirin|nsaid/i.test(a))) {
      contraindicated.push('Aspirin', 'Ibuprofen', 'Ketorolac (Toradol)');
    }
    if (profile.current_medications.some(m => /warfarin/i.test(m.name))) {
      contraindicated.push('Intramuscular injections without INR check', 'Non-essential antiplatelets');
    }

    const warnings: string[] = [];
    if (profile.blood_type) warnings.push(`Blood Group Verified: ${profile.blood_type}`);
    if (profile.allergies.length > 0) warnings.push(`Severe Allergies: ${profile.allergies.join(', ')}`);
    if (profile.chronic_conditions.length > 0) warnings.push(`Pre-existing: ${profile.chronic_conditions.join(', ')}`);
    if (profile.notes) warnings.push(`Alert: ${profile.notes}`);

    const actions: string[] = [
      'Maintain patent airway and continuous SpO2/ECG cardiac rhythm monitoring.',
      'Secure dual wide-bore IV access (16-18 gauge) for rapid fluid/blood protocol.',
      `Crossmatch and prepare compatible ${profile.blood_type} packed red cells if hemorrhaging.`,
      'Notify receiving Trauma Center ER of incoming critical patient with pre-loaded profile.'
    ];

    if (hasDiabetes) {
      actions.unshift('Immediate point-of-care capillary blood glucose (CBG) test.');
    }
    if (profile.chronic_conditions.some(c => /pacemaker/i.test(c))) {
      actions.unshift('Pacemaker present: Strict avoidance of electrocautery or unauthorized magnetic fields.');
    }

    return {
      triage_level,
      severity_color,
      summary_headline: `${profile.blood_type} Blood | ${profile.allergies.slice(0, 2).join(', ')} Allergy | ${profile.chronic_conditions[0] || 'No chronic condition'}`,
      critical_warnings: warnings,
      recommended_actions: actions,
      contraindicated_drugs: contraindicated.length > 0 ? contraindicated : ['None known'],
      generated_at: new Date().toISOString()
    };
  }
}

