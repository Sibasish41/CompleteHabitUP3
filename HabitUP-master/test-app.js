// Basic test script to check if the application is working
import http from 'http';

const testUrl = 'http://localhost:3000';

function testServer() {
  console.log('🧪 Testing HabitUP Application...');
  console.log('================================');
  
  const req = http.get(testUrl, (res) => {
    console.log(`✅ Server Response: ${res.statusCode}`);
    console.log(`✅ Server Headers:`, res.headers);
    
    if (res.statusCode === 200) {
      console.log('🎉 Application is running successfully!');
      console.log(`🌐 Open your browser and navigate to: ${testUrl}`);
      console.log('\n📝 Test Credentials:');
      console.log('Adult User: adult@habitup.com / password123');
      console.log('Child User: child@habitup.com / password123');
      console.log('Elder User: elder@habitup.com / password123');
      console.log('Doctor: doctor@habitup.com / password123');
      console.log('Admin: superuser@habitup.com / SuperUser@2024!');
    } else {
      console.log('⚠️ Server responded but with non-200 status');
    }
  });
  
  req.on('error', (err) => {
    console.log('❌ Server not running or not accessible');
    console.log('Error:', err.message);
    console.log('\n💡 Try running: npm run dev');
  });
  
  req.setTimeout(5000, () => {
    console.log('❌ Request timeout - server might be starting up');
    console.log('💡 Wait a few seconds and try again');
    req.destroy();
  });
}

// Wait a bit for server to start, then test
setTimeout(testServer, 3000);
