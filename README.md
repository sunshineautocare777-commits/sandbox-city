# Sandbox City — Three.js + Cannon-es

Protótipo jogável de sandbox 3D em ES Modules, sem etapa de build.

## Executar

Na pasta `gmod-gta-sandbox`, rode **`npx serve .`** e abra o endereço exibido (ou use a extensão Live Server do VS Code).

> É necessário servir por HTTP; abrir `index.html` diretamente via `file://` bloqueia módulos ES em vários navegadores. Requer internet para carregar Three.js, cannon-es, PeerJS e a fonte.

## Controles

- PC: WASD para mover, mouse para olhar (clique na tela para capturar), Espaço para pular.
- `1` / `F`: Physics Gun; `2` / `E`: Tool Gun; `3`: Blaster.
- Clique para usar a ferramenta selecionada; Enter não é necessário para o chat.
- Celular: use os dois joysticks e os botões PULAR/USAR.

## IA e multiplayer

O console interpreta comandos locais por palavras-chave e cria props/NPCs; não é um modelo de IA conectado à internet.
PeerJS permite testar conexão P2P entre navegadores. Para salas públicas confiáveis, produção, persistência, anticheat e sincronização robusta, configure um servidor PeerJS próprio e implemente validação/autorização.

## Escopo

Esta é uma base inicial funcional, não uma reprodução de Garry's Mod ou GTA V. O mapa, veículos, combate, animações, colisões detalhadas e rede podem ser expandidos por módulos. O projeto usa assets geométricos gerados em runtime e não inclui conteúdo protegido desses jogos.
