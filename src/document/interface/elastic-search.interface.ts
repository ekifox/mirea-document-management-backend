export interface IElasticSearchResponseShards {
    total: number
    successful: number
    skipped: number
    failed: number
}

export interface IElasticSearchResponseTotal {
    value: number
    relation: string
}

export interface IElasticSearchResponseAttachment {
    date: Date
    content_type: string
    author: string
    language: string
    content: string
    content_length: number
}

export interface IElasticSearchResponseSource {
    filename: string
    attachment: IElasticSearchResponseAttachment
}

export interface IElasticSearchResponseHit {
    _index: string
    _type: string
    _id: string
    _score: number
    _source: IElasticSearchResponseSource
}

export interface IElasticSearchResponseHits {
    total: IElasticSearchResponseTotal
    max_score: number
    hits: IElasticSearchResponseHit[]
}

export interface IElasticSearchResponse {
    took: number
    timed_out: boolean
    _shards: IElasticSearchResponseShards
    hits: IElasticSearchResponseHits
}
