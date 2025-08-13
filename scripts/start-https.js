#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');

console.log('🔐 شروع سرور HTTPS برای تماس تصویری...\n');
console.log('🎯 هدف: حل مشکل دسترسی دوربین');
console.log('📋 دلیل: تماس تصویری نیاز به HTTPS دارد\n');

// Check if ngrok is available
const ngrokProcess = spawn('npx', ['ngrok', '--version'], { stdio: 'ignore' });

ngrokProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ ngrok موجود است');
    startWithNgrok();
  } else {
    console.log('❌ ngrok موجود نیست');
    console.log('📝 راه‌حل‌های دیگر:');
    console.log('1. ngrok نصب کنید: npm install -g ngrok');
    console.log('2. از localhost استفاده کنید');
    console.log('3. از IP محلی استفاده کنید\n');
    
    showAlternatives();
  }
});

function startWithNgrok() {
  console.log('🚀 شروع Next.js server...');
  
  // Start Next.js development server
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Wait for Next.js to start, then start ngrok
  setTimeout(() => {
    console.log('🌐 شروع ngrok tunnel...');
    
    const ngrok = spawn('npx', ['ngrok', 'http', '3000'], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    ngrok.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('https://')) {
        const httpsUrl = output.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok\.io/);
        if (httpsUrl) {
          const baseUrl = httpsUrl[0];
          console.log('\n🎉 HTTPS URL آماده است:');
          console.log(`📱 ${baseUrl}`);
          console.log('\n🔗 لینک‌های تماس تصویری:');
          console.log(`👨‍🎓 دانش‌آموز: ${baseUrl}/students/temp-user-id/video-call`);
          console.log(`👨‍🏫 معلم: ${baseUrl}/teachers/teacher-id/video-call`);
          console.log(`🧪 تست: ${baseUrl}/test-video`);
          console.log('\n✨ حالا دوربین باید کار کند!');
          console.log('📝 اگر مشکل دارید، در صفحه تماس دکمه "راهنما" کلیک کنید\n');
        }
      }
    });

    ngrok.stderr.on('data', (data) => {
      console.log('ngrok:', data.toString());
    });
  }, 3000);

  nextProcess.stdout.on('data', (data) => {
    console.log('Next.js:', data.toString().trim());
  });

  nextProcess.stderr.on('data', (data) => {
    console.error('Next.js Error:', data.toString().trim());
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🔌 بستن سرورها...');
    nextProcess.kill();
    ngrok.kill();
    process.exit();
  });
}

function showAlternatives() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }

  console.log('💡 آدرس‌های IP محلی شما:');
  ips.forEach(ip => {
    console.log(`   http://${ip}:3000`);
  });
  
  console.log('\n📋 نکات:');
  console.log('• از localhost استفاده کنید: http://localhost:3000');
  console.log('• یا IP محلی (اگر در شبکه محلی هستید)');
  console.log('• یا ngrok نصب کنید: npm install -g ngrok');
  
  console.log('\n🚀 شروع Next.js server معمولی...');
  
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit'
  });

  process.on('SIGINT', () => {
    nextProcess.kill();
    process.exit();
  });
}
