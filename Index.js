// BOT LOJA PIX - SIMPLES E FUNCIONAL
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

// SEUS PRODUTOS - EDITE AQUI!
const produtos = {
  '1': { nome: '🎮 Fortnite V-Bucks', preco: 10.00, desc: '800 V-Bucks' },
  '2': { nome: '⛏️ Minecraft Premium', preco: 25.00, desc: 'Conta premium' },
  '3': { nome: '🧱 Roblox Robux', preco: 15.00, desc: '400 Robux' }
};

// CHAVE PIX - COLOQUE SUA CHAVE AQUI!
const CHAVE_PIX = '123.456.789-00'; // 🔄 ALTERE ISSO!

client.on('ready', () => {
  console.log(`✅ Bot online! ${client.user.tag}`);
  client.user.setActivity('!ajuda • Loja PIX');
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // COMANDO AJUDA
  if (message.content === '!ajuda') {
    const embed = new EmbedBuilder()
      .setTitle('🛍️ BOT LOJA PIX - AJUDA')
      .setDescription(`**Comandos:**\n\n!produtos - Ver produtos\n!comprar [1-3] - Comprar\n!comprovante - Enviar comprovante`)
      .setColor(0x00FF00);
    message.reply({ embeds: [embed] });
  }

  // COMANDO PRODUTOS
  if (message.content === '!produtos') {
    let lista = '📦 **PRODUTOS DISPONÍVEIS:**\n\n';
    for (const [id, prod] of Object.entries(produtos)) {
      lista += `**${id}.** ${prod.nome} - R$ ${prod.preco}\n   💬 ${prod.desc}\n\n`;
    }
    lista += '🛒 **Use: !comprar 1** (onde 1 é o número do produto)';
    
    const embed = new EmbedBuilder()
      .setTitle('🛍️ CATÁLOGO DA LOJA')
      .setDescription(lista)
      .setColor(0x0099FF);
    message.reply({ embeds: [embed] });
  }

  // COMANDO COMPRAR
  if (message.content.startsWith('!comprar')) {
    const num = message.content.split(' ')[1];
    const produto = produtos[num];
    
    if (!produto) {
      return message.reply('❌ **Produto não encontrado!** Use `!produtos`');
    }

    const embed = new EmbedBuilder()
      .setTitle('💰 PAGAMENTO PIX')
      .setDescription(`**Compra:** ${produto.nome}\n**Valor:** R$ ${produto.preco}\n**Descrição:** ${produto.desc}`)
      .addFields(
        { name: '📧 Chave PIX:', value: `\`${CHAVE_PIX}\`` },
        { name: '🏠 Nome:', value: 'Sua Loja' },
        { name: '📋 Instruções:', value: '1. Pague o PIX\n2. Tire print\n3. Use !comprovante e envie a imagem' }
      )
      .setColor(0xFF9900);
    
    message.author.send({ embeds: [embed] })
      .then(() => message.reply('📨 **Instruções enviadas no seu PRIVADO!**'))
      .catch(() => message.reply('❌ **Abra suas DM para receber as instruções!**'));
  }

  // COMPROVANTE
  if (message.content === '!comprovante') {
    message.reply('📸 **Envie o COMPROVANTE PIX como IMAGEM aqui!**\nAnalisaremos em até 15 minutos.');
  }

  // DETECTAR IMAGEM (comprovante)
  if (message.attachments.size > 0) {
    const img = message.attachments.first();
    if (img.contentType && img.contentType.startsWith('image/')) {
      message.reply('✅ **Comprovante recebido!** Verificando...');
      console.log(`📄 Comprovante de: ${message.author.tag}`);
    }
  }
});

// INICIAR BOT
client.login(process.env.TOKEN);
