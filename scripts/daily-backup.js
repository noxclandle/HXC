const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 設定
const BACKUP_DIR = path.join(__dirname, '../backups');
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not defined.');
  process.exit(1);
}

// バックアップディレクトリの作成
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.sql`);

console.log(`📡 Initializing memory capture: ${backupFile}`);

// pg_dumpを使用してバックアップ（ローカルDB想定）
// サーバー環境に合わせて調整が必要な場合があります
const command = `pg_dump ${DATABASE_URL} > ${backupFile}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Capture failed: ${error.message}`);
    return;
  }
  if (stderr) {
    console.warn(`⚠️ Capture Warning: ${stderr}`);
  }
  console.log('✅ Memory persisted. The archive is secure.');
  
  // 古いバックアップの削除（5日分保持）
  const files = fs.readdirSync(BACKUP_DIR);
  if (files.length > 5) {
    files.sort().slice(0, files.length - 5).forEach(file => {
      fs.unlinkSync(path.join(BACKUP_DIR, file));
      console.log(`🧹 Purged old fragment: ${file}`);
    });
  }
});
