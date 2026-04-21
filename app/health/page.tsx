export default function HealthPage() {
  return (
    <div style={{ backgroundColor: 'black', color: 'lime', padding: '50px', fontFamily: 'monospace' }}>
      <h1>SYSTEM_STATUS: ACTIVE</h1>
      <p>PRERENDER_TIME: {new Date().toISOString()}</p>
      <hr />
      <p>Vercel Deployment is functional.</p>
      <p>If you see this page, the Server Error (500) is caused by Database connection or NextAuth environment variables.</p>
    </div>
  );
}
