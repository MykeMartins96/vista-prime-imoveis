
// CONFIGURAÇÕES
const WHATSAPP_NUMBER = "5511999999999";

// IMÓVEIS DEMONSTRATIVOS
const imoveis = [
    {
        id: 1,
        titulo: "Apartamento moderno com varanda",
        tipo: "Apartamento",
        finalidade: "venda",
        bairro: "Moema",
        cidade: "São Paulo",
        preco: 850000,
        quartos: 3,
        banheiros: 2,
        vagas: 2,
        area: 95,
        imagem: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 2,
        titulo: "Casa sofisticada com piscina",
        tipo: "Casa",
        finalidade: "venda",
        bairro: "Morumbi",
        cidade: "São Paulo",
        preco: 1450000,
        quartos: 4,
        banheiros: 4,
        vagas: 3,
        area: 280,
        imagem: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 3,
        titulo: "Apartamento aconchegante",
        tipo: "Apartamento",
        finalidade: "aluguel",
        bairro: "Vila Mariana",
        cidade: "São Paulo",
        preco: 3200,
        quartos: 2,
        banheiros: 1,
        vagas: 1,
        area: 68,
        imagem: "./images/apartamento-vila-mariana.png"
    },
    {
        id: 4,
        titulo: "Cobertura com vista panorâmica",
        tipo: "Cobertura",
        finalidade: "venda",
        bairro: "Brooklin",
        cidade: "São Paulo",
        preco: 2200000,
        quartos: 4,
        banheiros: 3,
        vagas: 3,
        area: 210,
        imagem: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 5,
        titulo: "Casa espaçosa para sua família",
        tipo: "Casa",
        finalidade: "aluguel",
        bairro: "Santo Amaro",
        cidade: "São Paulo",
        preco: 4800,
        quartos: 3,
        banheiros: 2,
        vagas: 2,
        area: 160,
        imagem: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 6,
        titulo: "Apartamento elegante e iluminado",
        tipo: "Apartamento",
        finalidade: "venda",
        bairro: "Pinheiros",
        cidade: "São Paulo",
        preco: 690000,
        quartos: 2,
        banheiros: 2,
        vagas: 1,
        area: 82,
        imagem: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85"
    }
];

// ELEMENTOS DA PÁGINA
const grid = document.getElementById("properties-grid");
const contador = document.getElementById("results-count");
const vazio = document.getElementById("empty-state");
const formulario = document.getElementById("search-form");

const finalidade = document.getElementById("finalidade");
const tipo = document.getElementById("tipo");
const localizacao = document.getElementById("localizacao");

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

// SELEÇÃO DE IMÓVEIS
let selecionados = [];

try {
    const salvos = JSON.parse(
        localStorage.getItem("imoveisSelecionados") || "[]"
    );

    if (Array.isArray(salvos)) {
        selecionados = salvos.filter(id =>
            imoveis.some(imovel => imovel.id === id)
        );
    }
} catch {
    selecionados = [];
}

// IMAGEM RESERVA PARA LINKS QUE FALHAREM
const imagemReserva = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
    <rect width="100%" height="100%" fill="#e9e7e1"/>
    <text x="50%" y="47%" text-anchor="middle"
        font-family="Arial" font-size="35" fill="#17242c">
        Vista Prime Imóveis
    </text>
    <text x="50%" y="56%" text-anchor="middle"
        font-family="Arial" font-size="20" fill="#777">
        Imagem indisponível
    </text>
</svg>
`)}`;

// FUNÇÕES AUXILIARES
function preco(imovel) {
    const valor = imovel.preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0
    });

    return imovel.finalidade === "aluguel"
        ? `${valor}/mês`
        : valor;
}

function whatsapp(mensagem) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

function salvarSelecao() {
    localStorage.setItem(
        "imoveisSelecionados",
        JSON.stringify(selecionados)
    );
    atualizarContador();
}

function atualizarContador() {
    document.getElementById("selection-count").textContent =
        selecionados.length;
}

function criarImagem(imovel, classe = "") {
    const img = document.createElement("img");

    img.src = imovel.imagem;
    img.alt = imovel.titulo;
    img.className = classe;
    img.loading = "lazy";

    img.onerror = () => {
        img.onerror = null;
        img.src = imagemReserva;
    };

    return img;
}

// CARDS
function renderizarImoveis(lista) {
    grid.innerHTML = "";

    contador.textContent =
        `${lista.length} ${lista.length === 1
            ? "imóvel encontrado"
            : "imóveis encontrados"}`;

    vazio.hidden = lista.length !== 0;

    lista.forEach(imovel => {
        const card = document.createElement("article");
        card.className = "property-card";

        const imagemBox = document.createElement("div");
        imagemBox.className = "property-image";
        imagemBox.appendChild(criarImagem(imovel));

        const badge = document.createElement("span");
        badge.className = "property-badge";
        badge.textContent =
            imovel.finalidade === "venda" ? "À venda" : "Para alugar";

        imagemBox.appendChild(badge);

        const conteudo = document.createElement("div");
        conteudo.className = "property-content";

        const bairro = document.createElement("p");
        bairro.className = "property-location";
        bairro.textContent = `📍 ${imovel.bairro}, ${imovel.cidade}`;

        const titulo = document.createElement("h3");
        titulo.className = "property-title";
        titulo.textContent = imovel.titulo;

        const valor = document.createElement("p");
        valor.className = "property-price";
        valor.textContent = preco(imovel);

        const detalhes = document.createElement("div");
        detalhes.className = "property-details";
        detalhes.textContent =
            `${imovel.area} m² · ${imovel.quartos} quartos · ${imovel.banheiros} banheiros · ${imovel.vagas} vagas`;

        const botao = document.createElement("button");
        botao.className = "property-contact";
        botao.type = "button";
        botao.textContent = "Ver detalhes do imóvel →";
        botao.addEventListener("click", () => abrirDetalhes(imovel.id));

        imagemBox.style.cursor = "pointer";
        imagemBox.addEventListener("click", () => abrirDetalhes(imovel.id));

        conteudo.append(bairro, titulo, valor, detalhes, botao);
        card.append(imagemBox, conteudo);
        grid.appendChild(card);
    });
}

// CRIAR A INTERFACE EXTRA
const interfaceExtra = document.createElement("div");

interfaceExtra.innerHTML = `
    <button class="selection-floating" id="open-selection" type="button">
        ♡ Minha seleção
        <span id="selection-count">0</span>
    </button>

    <div class="custom-overlay" id="details-overlay" hidden>
        <section class="details-panel" role="dialog"
            aria-modal="true" aria-labelledby="details-title">
            <button class="close-panel" id="close-details"
                type="button" aria-label="Fechar detalhes">✕</button>
            <div id="details-content"></div>
        </section>
    </div>

    <div class="custom-overlay" id="selection-overlay" hidden>
        <section class="selection-panel" role="dialog"
            aria-modal="true" aria-labelledby="selection-title">
            <button class="close-panel" id="close-selection"
                type="button" aria-label="Fechar seleção">✕</button>
            <h2 id="selection-title">Minha seleção de imóveis</h2>
            <div id="selection-content"></div>
        </section>
    </div>
`;

document.body.appendChild(interfaceExtra);

const detailsOverlay = document.getElementById("details-overlay");
const selectionOverlay = document.getElementById("selection-overlay");

function fecharPaineis() {
    detailsOverlay.hidden = true;
    selectionOverlay.hidden = true;
    document.body.classList.remove("modal-open");
}

function mostrarPainel(painel) {
    fecharPaineis();
    painel.hidden = false;
    document.body.classList.add("modal-open");

    const fechar = painel.querySelector(".close-panel");
    fechar.focus();
}

// DETALHES DO IMÓVEL
function abrirDetalhes(id) {
    const imovel = imoveis.find(item => item.id === id);
    if (!imovel) return;

    const conteudo = document.getElementById("details-content");
    conteudo.innerHTML = "";

    const foto = criarImagem(imovel, "details-image");

    const info = document.createElement("div");
    info.className = "details-info";

    const titulo = document.createElement("h2");
    titulo.id = "details-title";
    titulo.textContent = imovel.titulo;

    const endereco = document.createElement("p");
    endereco.textContent = `📍 ${imovel.bairro}, ${imovel.cidade}`;

    const valor = document.createElement("h3");
    valor.textContent = preco(imovel);

    const caracteristicas = document.createElement("p");
    caracteristicas.textContent =
        `${imovel.tipo} · ${imovel.area} m² · ${imovel.quartos} quartos · ${imovel.banheiros} banheiros · ${imovel.vagas} vagas`;

    const descricao = document.createElement("p");
    descricao.textContent =
        "Conheça este imóvel e fale com nosso corretor para receber informações adicionais e agendar uma visita.";

    const adicionar = document.createElement("button");
    adicionar.className = "btn btn-primary";
    adicionar.type = "button";

    adicionar.textContent = selecionados.includes(id)
        ? "✓ Adicionado à seleção"
        : "♡ Adicionar à minha seleção";

    adicionar.addEventListener("click", () => {
        if (!selecionados.includes(id)) {
            selecionados.push(id);
            salvarSelecao();
        }
        adicionar.textContent = "✓ Adicionado à seleção";
    });

    const contato = document.createElement("a");
    contato.className = "btn btn-dark";
    contato.textContent = "Falar com corretor pelo WhatsApp";
    contato.href = whatsapp(
        `Olá! Gostaria de saber mais sobre o imóvel ${imovel.titulo}, em ${imovel.bairro}, anunciado por ${preco(imovel)}.`
    );
    contato.target = "_blank";
    contato.rel = "noopener noreferrer";

    info.append(
        titulo, endereco, valor,
        caracteristicas, descricao, adicionar, contato
    );

    conteudo.append(foto, info);
    mostrarPainel(detailsOverlay);
}

// SELEÇÃO DE IMÓVEIS
function abrirSelecao() {
    const conteudo = document.getElementById("selection-content");
    conteudo.innerHTML = "";

    if (selecionados.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Você ainda não selecionou nenhum imóvel.";
        conteudo.appendChild(mensagem);
    } else {
        selecionados.forEach(id => {
            const imovel = imoveis.find(item => item.id === id);
            if (!imovel) return;

            const item = document.createElement("div");
            item.className = "selection-item";

            const foto = criarImagem(imovel);

            const informacoes = document.createElement("div");
            const titulo = document.createElement("h3");
            titulo.textContent = imovel.titulo;

            const valor = document.createElement("p");
            valor.textContent = preco(imovel);

            const remover = document.createElement("button");
            remover.className = "remove-property";
            remover.type = "button";
            remover.textContent = "Remover";

            remover.addEventListener("click", () => {
                selecionados = selecionados.filter(itemId => itemId !== id);
                salvarSelecao();
                abrirSelecao();
            });

            informacoes.append(titulo, valor, remover);
            item.append(foto, informacoes);
            conteudo.appendChild(item);
        });

        const mensagem = selecionados
            .map(id => {
                const imovel = imoveis.find(item => item.id === id);
                return `- ${imovel.titulo} (${imovel.bairro}) - ${preco(imovel)}`;
            })
            .join("\n");

        const enviar = document.createElement("a");
        enviar.className = "btn btn-primary selection-send";
        enviar.textContent = "Enviar seleção pelo WhatsApp";
        enviar.href = whatsapp(
            `Olá! Tenho interesse nestes imóveis:\n\n${mensagem}\n\nGostaria de mais informações.`
        );
        enviar.target = "_blank";
        enviar.rel = "noopener noreferrer";

        conteudo.appendChild(enviar);
    }

    mostrarPainel(selectionOverlay);
}

// EVENTOS DOS PAINÉIS
document.getElementById("open-selection")
    .addEventListener("click", abrirSelecao);

document.getElementById("close-details")
    .addEventListener("click", fecharPaineis);

document.getElementById("close-selection")
    .addEventListener("click", fecharPaineis);

[detailsOverlay, selectionOverlay].forEach(painel => {
    painel.addEventListener("click", event => {
        if (event.target === painel) fecharPaineis();
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") fecharPaineis();
});

// FILTROS
formulario.addEventListener("submit", event => {
    event.preventDefault();

    const busca = localizacao.value.trim().toLocaleLowerCase("pt-BR");

    const resultados = imoveis.filter(imovel => {
        const finalidadeOk =
            finalidade.value === "todos" ||
            imovel.finalidade === finalidade.value;

        const tipoOk =
            tipo.value === "todos" ||
            imovel.tipo === tipo.value;

        const localOk =
            `${imovel.bairro} ${imovel.cidade}`
                .toLocaleLowerCase("pt-BR")
                .includes(busca);

        return finalidadeOk && tipoOk && localOk;
    });

    renderizarImoveis(resultados);

    document.getElementById("imoveis")
        .scrollIntoView({ behavior: "smooth" });
});

document.getElementById("clear-filters")
    .addEventListener("click", () => {
        formulario.reset();
        renderizarImoveis(imoveis);
    });

// MENU RESPONSIVO
menuToggle.addEventListener("click", () => {
    const aberto = navMenu.classList.toggle("active");
    menuToggle.textContent = aberto ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", String(aberto));
});

document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

// CONTATO PRINCIPAL
document.getElementById("contact-whatsapp").href =
    whatsapp("Olá! Gostaria de conhecer os imóveis disponíveis.");

document.getElementById("current-year").textContent =
    new Date().getFullYear();

// INICIAR
renderizarImoveis(imoveis);
atualizarContador();
