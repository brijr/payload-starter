import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { fileURLToPath } from 'url'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'

import sharp from 'sharp'
import path from 'node:path'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Posts } from '@/collections/Posts'

import type { Plugin } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const vercelBlobClientUploadHandler =
  '@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler'

const removeDisabledVercelBlobClientUploads: Plugin = (incomingConfig) => {
  if (!incomingConfig.admin) return incomingConfig

  if (incomingConfig.admin.dependencies?.[vercelBlobClientUploadHandler]) {
    delete incomingConfig.admin.dependencies[vercelBlobClientUploadHandler]
  }

  incomingConfig.admin.components ??= {}
  incomingConfig.admin.components.providers = incomingConfig.admin.components.providers?.filter(
    (provider) => {
      if (!provider) return true
      if (typeof provider === 'string') return provider !== vercelBlobClientUploadHandler
      if ('path' in provider) return provider.path !== vercelBlobClientUploadHandler
      return true
    },
  )

  return incomingConfig
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Posts, Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
    removeDisabledVercelBlobClientUploads,
  ],
})
