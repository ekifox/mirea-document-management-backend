import axios from 'axios'

async function createIndex() {
    const { data } = await axios.put('http://localhost:9200/documents', {
        mappings: {
            properties: {
                'attachment.content': {
                    type: 'text',
                    analyzer: 'russian'
                }
            }
        }
    })

    console.log(data)
}
async function createPipeline() {
    const { data } = await axios.put('http://localhost:9200/_ingest/pipeline/attachment', {
        description: 'Document indexes',
        processors: [
            {
                attachment: {
                    field: 'data'
                },
                remove: {
                    field: 'data'
                }
            }
        ]
    })

    console.log(data)
}

createIndex()
createPipeline()
