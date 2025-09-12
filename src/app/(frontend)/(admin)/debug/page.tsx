import { debugUserSync } from '@/lib/debug-user'

export default async function DebugPage() {
  const debug = await debugUserSync()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">User Sync Debug</h1>

      <div className="space-y-6">
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">NextAuth Session:</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(debug.nextAuth, null, 2)}
          </pre>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Payload User:</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(debug.payload, null, 2)}
          </pre>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">All Payload Users:</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(debug.allUsers, null, 2)}
          </pre>
        </div>

        {debug.error && (
          <div className="border border-red-300 bg-red-50 p-4 rounded">
            <h2 className="font-semibold mb-2 text-red-800">Error:</h2>
            <pre className="text-sm text-red-600">
              {JSON.stringify(debug.error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
