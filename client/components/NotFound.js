export default class NotFound {
    mount() {
        const container = document.getElementById('pageContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="not-found-container">
                <h1>404</h1>
                <p>Página não encontrada</p>
                <a href="/overview" class="btn btn-primary">Voltar para a Página Inicial</a>
            </div>
        `;
    }

    unmount() {
        const container = document.getElementById('pageContainer');
        if (container) {
            container.innerHTML = '';
        }
    }
} 