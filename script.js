const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbzQn_35tifJ0aCvme6tgV0byapZ3U_3BYezxbJrtW0G35N5Tp-B0lX585Sn4D727Lhrqw/exec";

const interestsByPhase = {
  "Tenho um bebê": ["Hidro Infantil", "Baby Genius", "Musicalização Infantil", "Spaço Nutrir", "Ballet Infantil", "Fisioterapia Pediátrica", "Consultoria de Sono", "Consultoria de Amamentação", "Fonoaudiologia Pediátrica"],
  "Tenho uma criança": ["Hidro Infantil", "Musicalização Infantil", "Ballet Infantil", "Spaço Nutrir", "Fisioterapia Pediátrica", "Fonoaudiologia Pediátrica", "Salão de Beleza Infantil"],
  "Estou grávida": ["Hidro Mommy", "Pilates trimestre a trimestre", "Drenagem linfática", "Cursos e palestras", "Fisioterapia pélvica", "Psicologia"],
  "Estou no pós-parto": ["Sling Dance", "Programa Fecha Diástase", "Consultoria de Sono", "Consultoria de Amamentação", "Fisioterapia pélvica", "Psicologia"],
  "Sou mulher": ["Kangoo Jumps", "Programa Fecha Diástase", "Fisioterapia pélvica", "Psicologia"]
};

const form = document.querySelector("#raffle-form");
const phaseOptions = document.querySelector("#phase-options");
const interestStep = document.querySelector("#interest-step");
const interestOptions = document.querySelector("#interest-options");
const whatsapp = document.querySelector("#whatsapp");
const submitButton = form.querySelector("button[type='submit']");

whatsapp.addEventListener("input", () => {
  let digits = whatsapp.value.replace(/\D/g, "").slice(0, 11);
  if (digits.length > 10) digits = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  else if (digits.length > 6) digits = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  else if (digits.length > 2) digits = digits.replace(/(\d{2})(\d+)/, "($1) $2");
  else if (digits.length) digits = digits.replace(/(\d{0,2})/, "($1");
  whatsapp.value = digits;
});

phaseOptions.addEventListener("change", renderInterests);

function renderInterests() {
  const phases = [...form.querySelectorAll("input[name='fase']:checked")].map(input => input.value);
  const previous = new Set([...form.querySelectorAll("input[name='interesses']:checked")].map(input => input.value));
  const interests = [...new Set(phases.flatMap(phase => interestsByPhase[phase] || []))];
  interestOptions.innerHTML = interests.map(interest => `
    <label class="pill">
      <input type="checkbox" name="interesses" value="${interest}" ${previous.has(interest) ? "checked" : ""} />
      <span>${interest}</span>
    </label>`).join("");
  interestStep.hidden = interests.length === 0;
  document.querySelector("#fase-step").classList.remove("invalid-group");
}

function validateForm() {
  let valid = true;
  form.querySelectorAll(".field").forEach(field => {
    const input = field.querySelector("input");
    let fieldValid = input.checkValidity();
    if (input === whatsapp && input.value.replace(/\D/g, "").length < 10) fieldValid = false;
    field.classList.toggle("invalid", !fieldValid);
    if (!fieldValid) valid = false;
  });

  const phaseStep = document.querySelector("#fase-step");
  const phaseValid = form.querySelectorAll("input[name='fase']:checked").length > 0;
  phaseStep.classList.toggle("invalid-group", !phaseValid);
  if (!phaseValid) valid = false;

  const rafflePanel = document.querySelector(".required-panel");
  const raffleValid = form.elements.participaSorteio.checked;
  rafflePanel.classList.toggle("invalid-group", !raffleValid);
  if (!raffleValid) valid = false;

  const visitBlock = document.querySelector(".visit-block");
  const visitValid = !!form.querySelector("input[name='visita']:checked");
  visitBlock.classList.toggle("invalid-group", !visitValid);
  if (!visitValid) valid = false;
  return valid;
}

form.addEventListener("input", event => {
  event.target.closest(".field")?.classList.remove("invalid");
  event.target.closest(".invalid-group")?.classList.remove("invalid-group");
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (submitButton.disabled) return;
  if (!validateForm()) {
    form.querySelector(".invalid, .invalid-group")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  document.querySelector("#data-hora").value = new Date().toISOString();
  submitButton.disabled = true;
  submitButton.classList.add("is-loading");
  form.querySelector(".submit-error").hidden = true;

  const data = Object.fromEntries(new FormData(form));
  data.fase = [...form.querySelectorAll("input[name='fase']:checked")].map(input => input.value).join(", ");
  data.interesses = [...form.querySelectorAll("input[name='interesses']:checked")].map(input => input.value).join(", ");
  data.participaSorteio = "Sim";
  data.autorizouComunicacao = form.elements.autorizouComunicacao.checked ? "Sim" : "Não";

  try {
    if (FORM_ENDPOINT) {
      const response = await fetch(FORM_ENDPOINT, { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "text/plain;charset=utf-8" } });
      if (!response.ok) throw new Error("Falha no envio");
    } else {
      await new Promise(resolve => setTimeout(resolve, 650));
      console.info("Modo demonstração — dados não enviados:", data);
    }
    showSuccess(data.visita);
  } catch (error) {
    form.querySelector(".submit-error").hidden = false;
    submitButton.disabled = false;
    submitButton.classList.remove("is-loading");
  }
});

function showSuccess(visitChoice) {
  document.querySelector(".form-section").hidden = true;
  const success = document.querySelector("#success");
  success.querySelector(".visit-success").hidden = visitChoice !== "Quero agendar uma visita guiada";
  success.hidden = false;
  success.focus();
  success.scrollIntoView({ behavior: "smooth", block: "center" });
}
