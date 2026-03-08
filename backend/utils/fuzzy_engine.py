import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

# ── Input Variables ──────────────────────────────
heat_sig  = ctrl.Antecedent(np.arange(0, 101, 1), 'heat_signature')
void_prob = ctrl.Antecedent(np.arange(0, 101, 1), 'void_probability')
time_hrs  = ctrl.Antecedent(np.arange(0, 73,  1), 'hours_since_quake')

# ── Output Variable ──────────────────────────────
survival  = ctrl.Consequent(np.arange(0, 101, 1), 'survival_score')

# ── Membership Functions ─────────────────────────
heat_sig['low']    = fuzz.trimf(heat_sig.universe, [0,  0,  40])
heat_sig['medium'] = fuzz.trimf(heat_sig.universe, [20, 50, 80])
heat_sig['high']   = fuzz.trimf(heat_sig.universe, [60, 100, 100])

void_prob['low']    = fuzz.trimf(void_prob.universe, [0,  0,  40])
void_prob['medium'] = fuzz.trimf(void_prob.universe, [20, 50, 80])
void_prob['high']   = fuzz.trimf(void_prob.universe, [60, 100, 100])

time_hrs['recent'] = fuzz.trimf(time_hrs.universe, [0,  0,  24])
time_hrs['medium'] = fuzz.trimf(time_hrs.universe, [12, 36, 60])
time_hrs['late']   = fuzz.trimf(time_hrs.universe, [48, 72, 72])

survival['low']      = fuzz.trimf(survival.universe, [0,  0,  40])
survival['moderate'] = fuzz.trimf(survival.universe, [25, 50, 75])
survival['critical'] = fuzz.trimf(survival.universe, [60, 100, 100])

# ── IF-THEN Rules ────────────────────────────────
rules = [
    ctrl.Rule(
        heat_sig['high'] & void_prob['high'] & time_hrs['recent'],
        survival['critical']
    ),
    ctrl.Rule(
        heat_sig['medium'] & void_prob['high'],
        survival['critical']
    ),
    ctrl.Rule(
        heat_sig['high'] & time_hrs['late'],
        survival['moderate']
    ),
    ctrl.Rule(
        heat_sig['medium'] & void_prob['medium'],
        survival['moderate']
    ),
    ctrl.Rule(
        heat_sig['low'],
        survival['low']
    ),
    ctrl.Rule(
        time_hrs['late'] & void_prob['low'],
        survival['low']
    ),
]

# ── Control System ───────────────────────────────
rescue_ctrl = ctrl.ControlSystem(rules)
rescue_sim  = ctrl.ControlSystemSimulation(rescue_ctrl)

# ── Main Function ────────────────────────────────
def get_survival_zone(heat, void, hours):
    try:
        rescue_sim.input['heat_signature']    = max(0, min(100, float(heat)))
        rescue_sim.input['void_probability']  = max(0, min(100, float(void)))
        rescue_sim.input['hours_since_quake'] = max(0, min(72,  float(hours)))
        rescue_sim.compute()

        score = round(rescue_sim.output['survival_score'], 2)
        zone  = (
            'CRITICAL' if score >= 65 else
            'MODERATE' if score >= 35 else
            'LOW'
        )

        return {
            'survival_score': score,
            'zone': zone
        }

    except Exception as e:
        return {
            'survival_score': 50.0,
            'zone': 'MODERATE',
            'note': str(e)
        }
