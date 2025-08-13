#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');

console.log('🔐 شروع سرور محلی برای تماس تصویری...\n');
console.log('🎯 هدف: حل مشکل دسترسی دوربین');
console.log('📋 راه‌حل: استفاده از IP محلی یا localhost\n');

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

function startServer() {
  console.log('🚀 شروع Next.js server...');
  
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  nextProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('Next.js:', output.trim());
    
    // Detect when server is ready
    if (output.includes('Ready in') || output.includes('✓ Ready')) {
      setTimeout(() => {
        showInstructions();
      }, 1000);
    }
  });

  nextProcess.stderr.on('data', (data) => {
    const output = data.toString();
    if (!output.includes('Warning:')) {
      console.error('Next.js Error:', output.trim());
    }
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🔌 بستن سرور...');
    nextProcess.kill();
    process.exit();
  });
}

function showInstructions() {
  const ips = getLocalIPs();
  
  console.log('\n🎉 سرور آماده است!');
  console.log('\n📱 آدرس‌های قابل استفاده:');
  
  // Localhost
  console.log(`\n🏠 Localhost (فقط این کامپیوتر):`);
  console.log(`   http://localhost:3000`);
  console.log(`   👨‍🎓 دانش‌آموز: http://localhost:3000/students/temp-user-id/video-call`);
  console.log(`   🧪 تست: http://localhost:3000/test-video`);
  
  // Local network IPs
  if (ips.length > 0) {
    console.log(`\n🌐 شبکه محلی (سایر دستگاه‌ها در همین WiFi):`);
    ips.forEach(ip => {
      console.log(`   http://${ip}:3000`);
      console.log(`   👨‍🎓 دانش‌آموز: http://${ip}:3000/students/temp-user-id/video-call`);
    });
  }
  
  console.log('\n✅ نکات مهم:');
  console.log('• دوربین در localhost کار می‌کند');
  console.log('• برای دستگاه‌های دیگر از IP محلی استفاده کنید');
  console.log('• اگر دوربین کار نکرد، دکمه "راهنما" کلیک کنید');
  
  console.log('\n🔧 برای HTTPS (اگر localhost کار نکرد):');
  console.log('• ثبت‌نام در ngrok: https://dashboard.ngrok.com/signup');
  console.log('• یا از localtunnel: npx localtunnel --port 3000');
  console.log('• یا از cloudflared: cloudflared tunnel --url localhost:3000');
  
  console.log('\n📝 آماده تست!\n');
}

startServer();
