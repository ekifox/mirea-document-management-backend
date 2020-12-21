import { Injectable } from '@nestjs/common'
import { IElasticSearchResponse } from './interface/elastic-search.interface'
import axios from 'axios'
import { Base64String } from './type/Base64String'

@Injectable()
export class ElasticService {
    private axiosClient = axios.create({
        baseURL: 'http://localhost:9200'
    })

    constructor() {
        this.axiosClient.interceptors.response.use(
            response => {
                return response
            },
            error => {
                console.error(JSON.stringify(error.response.data))
                return Promise.reject(error)
            }
        )
    }

    public async search(text: string) {
        const { data } = await this.axiosClient.post<IElasticSearchResponse>('/documents/_search', {
            sort: [
                {
                    _score: 'desc'
                }
            ],
            query: {
                match: {
                    'attachment.content': {
                        query: text
                    }
                }
            },
            highlight: {
                order: 'score',
                fields: {
                    'attachment.content': {
                        type: 'plain',
                        fragment_size: 150,
                        number_of_fragments: 2,
                        no_match_size: 150,
                        fragmenter: 'span'
                    }
                },
                require_field_match: true,
                encoder: 'html',
                pre_tags: ['<mark>'],
                post_tags: ['</mark>']
            }
        })

        return data
    }

    public async upload(documentUuid: string, base64string: Base64String) {
        const isBase64Encoded = Buffer.from(base64string, 'base64').toString('base64') === base64string

        if (!isBase64Encoded) {
            throw new Error('Provided string is not base64-encoded')
        }

        return await this.axiosClient.put(`/documents/_doc/${documentUuid}?pipeline=attachment`, {
            filename: documentUuid + '.pdf',
            data: base64string
        })
    }
}
