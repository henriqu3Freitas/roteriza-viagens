const STORAGE_KEY = 'roteiriza-viagens';
const API_URL = 'https://countriesnow.space/api/v0.1/countries/info?returns=currency';

const initialTrips = [
  {
    id: 'paris-1728979200000',
    cidade: 'Paris',
    pais: 'França',
    ida: '2024-10-15',
    volta: '2024-10-22',
    orcamento: 8500,
    status: 'planejada',
    anotacoes: 'Visitar a Torre Eiffel e conhecer alguns museus.',
    moeda: 'Euro (EUR)',
    idioma: 'Francês',
    regiao: 'Europa',
    imagem: 'assets/img/paris.jpg'
  },
  {
    id: 'amsterda-1733097600000',
    cidade: 'Amsterdã',
    pais: 'Holanda',
    ida: '2024-12-02',
    volta: '2024-12-09',
    orcamento: 5200,
    status: 'planejada',
    anotacoes: 'Passear pelos canais e visitar o Rijksmuseum.',
    moeda: 'Euro (EUR)',
    idioma: 'Neerlandês',
    regiao: 'Europa',
    imagem: 'assets/img/paris.jpg'
  },
  {
    id: 'salvador-1720569600000',
    cidade: 'Salvador',
    pais: 'Brasil',
    ida: '2024-07-10',
    volta: '2024-07-15',
    orcamento: 2000,
    status: 'concluida',
    anotacoes: 'Conhecer o Pelourinho e provar a culinária baiana.',
    moeda: 'Real brasileiro (BRL)',
    idioma: 'Português',
    regiao: 'Américas',
    imagem: 'assets/img/paris.jpg'
  }
];

let trips = loadTrips();
let selectedTripId = trips[0]?.id || null;

const elements = {
  form: document.querySelector('#trip-form'),
  list: document.querySelector('#trip-list'),
  details: document.querySelector('#trip-details'),
  feedback: document.querySelector('#form-feedback'),
  search: document.querySelector('#destino-pesquisa'),
  statusFilter: document.querySelector('#filtro-status'),
  sort: document.querySelector('#ordenacao'),
  resultCount: document.querySelector('#result-count'),
  city: document.querySelector('#cidade'),
  country: document.querySelector('#pais'),
  currency: document.querySelector('#moeda'),
  language: document.querySelector('#idioma'),
  region: document.querySelector('#regiao'),
  id: document.querySelector('#trip-id'),
  image: document.querySelector('#imagem'),
  submit: document.querySelector('#submit-trip'),
  heroTotal: document.querySelector('#hero-total'),
  total: document.querySelector('#total-trips'),
  upcoming: document.querySelector('#upcoming-trips'),
  budget: document.querySelector('#total-budget'),
  completed: document.querySelector('#completed-trips')
};

function loadTrips() {
  try {
    const savedTrips = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(savedTrips)) return savedTrips;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTrips));
    return initialTrips;
  } catch (error) {
    console.error('Não foi possível carregar as viagens salvas.', error);
    return initialTrips;
  }
}

function saveTrips() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[character]));
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR');
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL'
  });
}

function statusLabel(status) {
  return { planejada: 'Planejada', andamento: 'Em andamento', concluida: 'Concluída' }[status];
}

function statusClass(status) {
  return status === 'concluida' ? 'status-done' : status === 'andamento' ? 'status-progress' : 'status-planned';
}

function getVisibleTrips() {
  const search = elements.search.value.trim().toLocaleLowerCase('pt-BR');
  const filtered = trips.filter((trip) => {
    const matchesSearch = `${trip.cidade} ${trip.pais}`.toLocaleLowerCase('pt-BR').includes(search);
    const matchesStatus = elements.statusFilter.value === 'todos' || trip.status === elements.statusFilter.value;
    return matchesSearch && matchesStatus;
  });

  return filtered.sort((first, second) => {
    if (elements.sort.value === 'destino') return first.cidade.localeCompare(second.cidade, 'pt-BR');
    if (elements.sort.value === 'orcamento') return Number(second.orcamento) - Number(first.orcamento);
    return first.ida.localeCompare(second.ida);
  });
}

function renderTrips() {
  const visibleTrips = getVisibleTrips();
  elements.resultCount.textContent = `${visibleTrips.length} ${visibleTrips.length === 1 ? 'resultado' : 'resultados'}`;
  elements.list.innerHTML = visibleTrips.length ? visibleTrips.map((trip) => `
    <tr>
      <td><strong>${escapeHtml(trip.cidade)}</strong><span>${escapeHtml(trip.pais)}</span></td>
      <td><time datetime="${trip.ida}">${formatDate(trip.ida)}</time></td>
      <td><time datetime="${trip.volta}">${formatDate(trip.volta)}</time></td>
      <td>${formatMoney(trip.orcamento)}</td>
      <td><span class="status ${statusClass(trip.status)}">${statusLabel(trip.status)}</span></td>
      <td class="actions">
        <button type="button" class="link-button" data-action="details" data-id="${trip.id}">Detalhes</button>
        <button type="button" class="link-button" data-action="edit" data-id="${trip.id}">Editar</button>
        <button type="button" class="delete-action" data-action="delete" data-id="${trip.id}">Excluir</button>
      </td>
    </tr>
  `).join('') : '<tr><td class="empty-state" colspan="6">Nenhuma viagem encontrada.</td></tr>';

  updateSummary();
  renderDetails(selectedTripId && trips.some((trip) => trip.id === selectedTripId) ? selectedTripId : trips[0]?.id);
}

function updateSummary() {
  const completed = trips.filter((trip) => trip.status === 'concluida').length;
  const upcoming = trips.filter((trip) => trip.status !== 'concluida').length;
  const budget = trips.reduce((total, trip) => total + Number(trip.orcamento || 0), 0);
  elements.heroTotal.textContent = String(trips.length).padStart(2, '0');
  elements.total.textContent = String(trips.length).padStart(2, '0');
  elements.upcoming.textContent = String(upcoming).padStart(2, '0');
  elements.completed.textContent = String(completed).padStart(2, '0');
  elements.budget.textContent = formatMoney(budget).replace(',00', '');
}

function renderDetails(id) {
  const trip = trips.find((item) => item.id === id);
  if (!trip) {
    elements.details.innerHTML = '<div class="detail-content"><h3>Nenhuma viagem cadastrada</h3><p class="detail-intro">Cadastre sua primeira viagem para visualizar os detalhes aqui.</p></div>';
    return;
  }
  const evaluation = evaluateTrip(trip);
  selectedTripId = trip.id;
  elements.details.innerHTML = `
    <div class="detail-image">
      <img src="${escapeHtml(trip.imagem || 'assets/img/paris.jpg')}" alt="Imagem de ${escapeHtml(trip.cidade)}">
      <span class="status ${statusClass(trip.status)}">${statusLabel(trip.status)}</span>
    </div>
    <div class="detail-content">
      <h3>${escapeHtml(trip.cidade)}, ${escapeHtml(trip.pais)}</h3>
      <p class="detail-intro">${escapeHtml(trip.anotacoes || 'Uma nova experiência esperando para acontecer.')}</p>
      <div class="detail-facts">
        <p><span>Período</span><strong>${formatDate(trip.ida)} a ${formatDate(trip.volta)}</strong></p>
        <p><span>Orçamento</span><strong>${formatMoney(trip.orcamento)}</strong></p>
        <p><span>Região</span><strong>${escapeHtml(trip.regiao || 'Não informado')}</strong></p>
      </div>
      <p class="notes"><strong>Informações locais</strong> ${escapeHtml(trip.idioma || 'Idioma não informado')} · ${escapeHtml(trip.moeda || 'Moeda não informada')}</p>
      <section class="trip-evaluation ${evaluation.isWorthIt ? 'evaluation-positive' : 'evaluation-warning'}" aria-labelledby="evaluation-title">
        <div class="evaluation-heading">
          <div>
            <span class="evaluation-label">Análise rápida</span>
            <h4 id="evaluation-title">${evaluation.isWorthIt ? 'Essa viagem parece compensar' : 'Vale revisar antes de decidir'}</h4>
          </div>
          <strong class="evaluation-score">${evaluation.score}/${evaluation.total}</strong>
        </div>
        <p class="evaluation-explanation">${evaluation.explanation}</p>
        <div class="evaluation-columns">
          <div><strong>Dados positivos</strong><ul>${evaluation.positives.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
          <div><strong>Pontos de atenção</strong><ul>${evaluation.negatives.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
        </div>
      </section>
      <div class="detail-actions">
        <button class="button button-primary" type="button" data-action="edit" data-id="${trip.id}">Editar viagem</button>
        <button class="button button-danger" type="button" data-action="delete" data-id="${trip.id}">Excluir viagem</button>
      </div>
    </div>
  `;
}

function getTripDuration(trip) {
  const start = new Date(`${trip.ida}T00:00:00`);
  const end = new Date(`${trip.volta}T00:00:00`);
  return Math.round((end - start) / 86400000) + 1;
}

function evaluateTrip(trip) {
  const duration = getTripDuration(trip);
  const positives = [];
  const negatives = [];
  if (Number(trip.orcamento) > 0) positives.push(`Orçamento estimado de ${formatMoney(trip.orcamento)}.`);
  else negatives.push('Informe um orçamento para avaliar melhor o custo-benefício.');
  if (duration >= 3) positives.push(`${duration} dias permitem aproveitar melhor o destino.`);
  else negatives.push('A viagem tem poucos dias; confira se o deslocamento vale o tempo disponível.');
  if (trip.anotacoes?.trim()) positives.push('Você já registrou ideias e objetivos para a viagem.');
  else negatives.push('Adicione anotações ou objetivos para deixar o planejamento mais completo.');
  if (trip.imagem && trip.imagem !== 'assets/img/paris.jpg') positives.push('A viagem já tem uma imagem personalizada.');
  else negatives.push('Adicione uma imagem para personalizar o registro da viagem.');
  const score = positives.length;
  return {
    positives,
    negatives,
    score,
    total: positives.length + negatives.length,
    isWorthIt: score >= negatives.length,
    explanation: 'Este veredito é uma triagem baseada apenas nos dados cadastrados, não uma previsão de preços ou qualidade da viagem.'
  };
}

function fillForm(trip) {
  Object.entries(trip).forEach(([key, value]) => {
    const field = elements.form.elements[key];
    if (field && key !== 'imagem') field.value = value;
  });
  elements.image.value = '';
  elements.submit.innerHTML = 'Atualizar viagem <span aria-hidden="true">→</span>';
  document.querySelector('#cadastro-titulo').textContent = 'Editar viagem';
  document.querySelector('#cadastro').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
  elements.form.reset();
  elements.id.value = '';
  elements.submit.innerHTML = 'Salvar viagem <span aria-hidden="true">→</span>';
  document.querySelector('#cadastro-titulo').textContent = 'Cadastrar nova viagem';
  elements.feedback.textContent = '';
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.readAsDataURL(file);
  });
}

async function loadCountryData() {
  const country = elements.country.value.trim();
  if (!country) return;
  elements.feedback.textContent = 'Buscando informações do país...';
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) throw new Error('País não encontrado');
    const data = await response.json();
    const normalizedCountry = country.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const countryData = data.data.find((item) => {
      const normalizedName = item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      return normalizedName === normalizedCountry ||
        (normalizedCountry === 'brasil' && normalizedName === 'brazil') ||
        (normalizedCountry === 'holanda' && normalizedName === 'netherlands');
    });
    if (!countryData) throw new Error('País não encontrado');
    elements.currency.value = countryData.currency || '';
    elements.feedback.textContent = 'Moeda preenchida pela API pública CountriesNow.';
  } catch (error) {
    elements.feedback.textContent = 'Não foi possível buscar os dados desse país. Você ainda pode salvar a viagem.';
  }
}

elements.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(elements.form);
  const imageFile = formData.get('imagem');
  const data = Object.fromEntries(formData);
  delete data.imagem;
  if (data.ida > data.volta) {
    elements.feedback.textContent = 'A data de volta deve ser posterior à data de ida.';
    return;
  }
  const editing = Boolean(data.id);
  const previousTrip = trips.find((item) => item.id === data.id);
  let imagem = previousTrip?.imagem || 'assets/img/paris.jpg';
  if (imageFile instanceof File && imageFile.size > 0) {
    if (!imageFile.type.startsWith('image/')) {
      elements.feedback.textContent = 'Escolha um arquivo de imagem válido.';
      return;
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      elements.feedback.textContent = 'A imagem deve ter no máximo 5 MB.';
      return;
    }
    try {
      imagem = await readImage(imageFile);
    } catch (error) {
      elements.feedback.textContent = 'Não foi possível carregar a imagem escolhida.';
      return;
    }
  }
  const trip = { ...data, imagem, orcamento: Number(data.orcamento || 0), id: data.id || `${Date.now()}-${data.cidade.toLowerCase()}` };
  trips = editing ? trips.map((item) => item.id === data.id ? { ...item, ...trip } : item) : [...trips, trip];
  saveTrips();
  selectedTripId = trip.id;
  renderTrips();
  resetForm();
  elements.feedback.textContent = editing ? 'Viagem atualizada com sucesso!' : 'Viagem cadastrada com sucesso!';
  document.querySelector('#viagens').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('#reset-form').addEventListener('click', resetForm);
elements.country.addEventListener('blur', loadCountryData);
document.querySelector('#search-form').addEventListener('submit', (event) => event.preventDefault());
[elements.search, elements.statusFilter, elements.sort].forEach((control) => control.addEventListener('input', renderTrips));

document.addEventListener('click', (event) => {
  const actionElement = event.target.closest('[data-action]');
  if (!actionElement) return;
  const { action, id } = actionElement.dataset;
  const trip = trips.find((item) => item.id === id);
  if (!trip) return;
  if (action === 'details') {
    renderDetails(id);
    document.querySelector('.details-section').scrollIntoView({ behavior: 'smooth' });
  } else if (action === 'edit') {
    fillForm(trip);
  } else if (action === 'delete' && window.confirm(`Excluir a viagem para ${trip.cidade}?`)) {
    trips = trips.filter((item) => item.id !== id);
    saveTrips();
    selectedTripId = trips[0]?.id || null;
    renderTrips();
  }
});

renderTrips();