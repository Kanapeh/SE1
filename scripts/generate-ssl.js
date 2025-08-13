const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certDir = path.join(__dirname, '..', 'ssl');

// Create SSL directory if it doesn't exist
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

const keyPath = path.join(certDir, 'localhost.key');
const certPath = path.join(certDir, 'localhost.crt');

// Check if certificates already exist
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('✅ SSL certificates already exist!');
  console.log(`Key: ${keyPath}`);
  console.log(`Cert: ${certPath}`);
  process.exit(0);
}

try {
  console.log('🔐 Generating SSL certificates for localhost...');
  
  // Generate self-signed certificate for localhost
  const command = `openssl req -x509 -out ${certPath} -keyout ${keyPath} \\
    -newkey rsa:2048 -nodes -sha256 \\
    -subj '/CN=localhost' -extensions EXT -config <( \\
    printf "[dn]\\nCN=localhost\\n[req]\\ndistinguished_name = dn\\n[EXT]\\nsubjectAltName=DNS:localhost,DNS:127.0.0.1,IP:127.0.0.1\\nkeyUsage=keyEncipherment,dataEncipherment\\nextendedKeyUsage=serverAuth")`;
  
  execSync(command, { stdio: 'inherit', shell: '/bin/bash' });
  
  console.log('✅ SSL certificates generated successfully!');
  console.log(`Key: ${keyPath}`);
  console.log(`Cert: ${certPath}`);
  console.log('\n📝 To trust the certificate on macOS:');
  console.log(`sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${certPath}`);
  
} catch (error) {
  console.error('❌ Error generating SSL certificates:', error.message);
  console.log('\n💡 Alternative solutions:');
  console.log('1. Use ngrok: npx ngrok http 3000');
  console.log('2. Use localtunnel: npx localtunnel --port 3000');
  console.log('3. Access via IP: http://192.168.x.x:3000 (if on same network)');
}
