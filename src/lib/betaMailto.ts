/**
 * Generates a mailto: URI for beta tester application.
 * Opens user's default email client (Gmail, etc.) with pre-filled subject and body.
 */
export function buildBetaMailto(lang: "it" | "en" = "it"): string {
  const to = "beta@citycat.app";

  const subject = lang === "it"
    ? "Candidatura Beta Tester – City Cat"
    : "Beta Tester Application – City Cat";

  const body = lang === "it"
    ? `Ciao team City Cat,

Mi candido come Beta Tester per la piattaforma City Cat.

Nome: [il tuo nome]
Email: [la tua email]
Ruolo desiderato: [Adottante / Ente / Volontario / Veterinario / Cat Sitter / Staffettista / Affido / Comportamentalista / Comune-ASL]

Motivazione:
[Scrivi brevemente perché vorresti partecipare alla Beta]

Esperienza con gatti:
[Descrivi la tua esperienza]

Città/Zona: [la tua zona]

Grazie!`
    : `Hi City Cat team,

I'd like to apply as a Beta Tester for the City Cat platform.

Name: [your name]
Email: [your email]
Desired role: [Adopter / Shelter / Volunteer / Vet / Cat Sitter / Relay / Foster / Behaviorist / Municipality]

Motivation:
[Briefly describe why you'd like to join the Beta]

Experience with cats:
[Describe your experience]

City/Area: [your area]

Thank you!`;

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
