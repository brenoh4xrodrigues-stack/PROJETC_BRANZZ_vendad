const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express'); // ← IMPORTANTE adicionar

const app = express();
const port = process.env.PORT || 3000;

// Web server simples para Render
app.get('/', (req, res) => {
  res.send('🤖 Bot Discord Online!');
});

app.listen(port, () => {
  console.log(`🟢 Servidor web rodando na porta ${port}`);
});

// SEU BOT AQUI
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

// PRODUTOS - EDITE AQUI!
const produtos = {
  '1': { nome: '🎮 Fortnite V-Bucks', preco: 10.00, desc: '800 V-Bucks' },
  '2': { nome: '⛏️ Minecraft Premium', preco: 25.00, desc: 'Conta premium' },
  '3': { nome: '🧱 Roblox Robux', preco: 15.00, desc: '400 Robux' }
};

const CHAVE_PIX = '123.456.789-00'; // COLOQUE SUA CHAVE PIX AQUI

client.on('ready', () => {
  console.log(`✅ Bot online! ${client.user.tag}`);
  client.user.setActivity('!ajuda • Loja PIX');
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content === '!ajuda') {
    const embed = new EmbedBuilder()
      .setTitle('🛍️ BOT LOJA PIX')
      .setDescription('**Comandos:**\n\n!produtos - Ver catálogo\n!comprar 1 - Comprar produto 1\n!comprovante - Enviar comprovante')
      .setColor(0x00FF00);
    message.reply({ embeds: [embed] });
  }

  if (message.content === '!produtos') {
    let lista = '**🛍️ PRODUTOS:**\n\n';
    for (const [id, prod] of Object.entries(produtos)) {
      lista += `**${id}.** ${prod.nome} - R$ ${prod.preco}\n`;
    }
    
    const embed = new EmbedBuilder()
      .setTitle('📦 CATÁLOGO')
      .setDescription(lista)
      .setColor(0x0099FF);
    message.reply({ embeds: [embed] });
  }

  if (message.content.startsWith('!comprar')) {
    const num = message.content.split(' ')[1];
    const produto = produtos[num];
    
    if (!produto) return message.reply('❌ Use: !comprar 1, 2 ou 3');

    const embed = new EmbedBuilder()
      .setTitle('💰 PAGAMENTO PIX')
      .setDescription(`**Produto:** ${produto.nome}\n**Valor:** R$ ${produto.preco}`)
      .addFields(
        { name: '📧 Chave PIX:', value: `\`${CHAVE_PIX}\`` },
        { name: '🏠 Nome:', value: 'Sua Loja' },
        { name: '📋 Instruções:', value: '1. Pague o PIX\n2. Tire print\n3. Use !comprovante' }
      )
      .setColor(0xFF9900);
    
    message.author.send({ embeds: [embed] })
      .then(() => message.reply('📨 **Instruções no PRIVADO!**'))
      .catch(() => message.reply('❌ **Abra suas DM!**'));
  }

  if (message.content === '!comprovante') {
    message.reply('📸 **Envie o COMPROVANTE como IMAGEM aqui!**');
  }

  // Detectar imagem
  if (message.attachments.size > 0) {
    const img = message.attachments.first();
    if (img.contentType && img.contentType.startsWith('image/')) {
      message.reply('✅ **Comprovante recebido!** Verificando...');
    }
  }
});

// INICIAR BOT
client.login(process.env.TOKEN);
