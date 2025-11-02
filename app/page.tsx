export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          🏃‍♂️ WWTRAIL
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Trail Running Competitions Platform
        </p>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">✅ Setup Completo</h2>
          <ul className="text-left space-y-2">
            <li>✅ Next.js 14 con App Router</li>
            <li>✅ TypeScript configurado</li>
            <li>✅ TailwindCSS + Variables CSS</li>
            <li>✅ Estructura de carpetas</li>
            <li>✅ Variables de entorno</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
