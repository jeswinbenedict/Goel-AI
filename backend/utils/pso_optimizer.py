import numpy as np

def optimize_rescue_routes(survivor_coords, team_positions):
    survivors = np.array(survivor_coords)
    teams     = np.array(team_positions)

    n_particles = 30
    n_iters     = 100
    w           = 0.7
    c1          = 1.5
    c2          = 1.5

    # ── Initialize particles ─────────────────────
    particles  = np.random.randint(0, len(survivors), (n_particles, len(teams)))
    velocities = np.zeros_like(particles, dtype=float)
    pbest      = particles.copy()
    pbest_score= np.full(n_particles, np.inf)
    gbest      = particles[0].copy()
    gbest_score= np.inf

    # ── Cost Function ────────────────────────────
    def cost(assignment):
        total = 0
        for i, s in enumerate(assignment):
            s_idx  = int(s) % len(survivors)
            dist   = np.sqrt(np.sum((teams[i] - survivors[s_idx]) ** 2))
            total += dist
        return total

    # ── PSO Main Loop ────────────────────────────
    for _ in range(n_iters):
        for i in range(n_particles):
            score = cost(particles[i])

            if score < pbest_score[i]:
                pbest_score[i] = score
                pbest[i]       = particles[i].copy()

            if score < gbest_score:
                gbest_score = score
                gbest       = particles[i].copy()

        r1 = np.random.rand()
        r2 = np.random.rand()

        velocities = (
            w  * velocities +
            c1 * r1 * (pbest - particles) +
            c2 * r2 * (gbest - particles)
        )

        particles = np.clip(
            (particles + velocities).astype(int),
            0,
            len(survivors) - 1
        )

    # ── Build Result ─────────────────────────────
    routes = []
    for i, s in enumerate(gbest):
        s_idx = int(s) % len(survivors)
        routes.append({
            'team':     f'Team {i + 1}',
            'target':   f'Survivor #{s_idx + 1}',
            'team_pos': teams[i].tolist(),
            'surv_pos': survivors[s_idx].tolist(),
        })

    return {
        'routes':     routes,
        'total_cost': round(float(gbest_score), 4),
        'iterations': n_iters,
        'particles':  n_particles
    }
