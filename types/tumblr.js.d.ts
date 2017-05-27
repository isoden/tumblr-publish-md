
declare module 'tumblr.js' {
  namespace TumblrJs {
    interface Credentials {
      consumer_key: string
      consumer_secret: string
      token: string
      token_secret: string
    }

    interface RequestLibrary {
      get<T>(options: Object, callback: (options: Object) => T): T
      post<T>(options: Object, callback: (options: Object) => T): T
    }

    interface Callback {
      (err: Error | null, req: Request, rawResponse?: string): void
    }

    type ApiResponse<T = { id: string }> = Request | Promise<T> | any

    interface ConstructOptions {
      credentials: Credentials
      baseUrl: string
      request: RequestLibrary
      returnPromises: boolean
    }

    namespace Response {
      interface BlogInfo {
        blog: {
          admin: boolean
          ask: boolean
          ask_anon: boolean
          ask_page_title: string
          can_send_fan_mail: boolean
          can_submit: boolean
          can_subscribe: boolean
          description: string
          drafts: number
          facebook: 'N'
          facebook_opengraph_enabled: 'N'
          followed: boolean
          followers: number
          is_adult: boolean
          is_blocked_from_primary: boolean
          is_nsfw: boolean
          likes: number
          messages: number
          name: string
          posts: number
          primary: boolean
          queue: number
          reply_conditions: string
          share_likes: boolean
          submission_page_title: string
          submission_terms: {
            accepted_types: Object
            tags: Array<string>
            title: string
            guidelines: string
          },
          subscribed: boolean
          title: string
          total_posts: number
          tweet: 'N'
          twitter_enabled: boolean
          twitter_send: boolean
          type: string
          updated: number
          url: string
        }
      }

      interface BlogAvatar {
        avatar_url: string
      }
    }

    class Client {
      constructor(options?: Partial<ConstructOptions>)

      /**
       * Gets information about a given blog
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - optional data sent with the request
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      blogInfo(blogIdentifier: string, params?: Object, callback?: Callback): ApiResponse<Response.BlogInfo>

      /**
       * Gets the avatar URL for a blog
       *
       * @param blogIdentifier - blog name or URL
       * @param size           - avatar size, in pixels
       * @param params         - optional data sent with the request
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      blogAvatar(blogIdentifier: string, size?: number, params?: Object, callback?: Callback): ApiResponse<Response.BlogAvatar>

      /**
       * Gets the likes for a blog
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - optional data sent with the request
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      blogLikes(blogIdentifier: string, params?: Object, callback?: Callback): ApiResponse

      /**
       * Gets the followers for a blog
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - optional data sent with the request
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      blogFollowers(blogIdentifier: string, params?: Object, callback?: Callback): ApiResponse

      /**
       * Gets a list of posts for a blog
       *
       * @param blogIdentifier - blog name or URL
       * @param type           - filters returned posts to the specified type
       * @param params         - optional data sent with the request
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      blogPosts(blogIdentifier: string, type?: string, params?: Object, callback?: Callback): ApiResponse

      /**
       * Gets the queue for a blog
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - optional data sent with the request
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      blogQueue(blogIdentifier: string, params?: Object, callback?: Callback): ApiResponse

      /**
       * Gets the drafts for a blog
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - optional data sent with the request
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      blogDrafts(blogIdentifier: string, params?: Object, callback?: Callback): ApiResponse

      /**
       * Gets the submissions for a blog
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - optional parameters sent with the request
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      blogSubmissions(blogIdentifier: string, params?: Object, callback?: Callback): ApiResponse

      /**
       * Gets information about the authenticating user and their blogs
       *
       * @param params   - optional parameters sent with the request
       * @param callback - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      userInfo(params?: Object, callback?: Callback): ApiResponse

      /**
       * Gets the dashboard posts for the authenticating user
       *
       * @param params   - optional parameters sent with the request
       * @param callback - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      userDashboard(params?: Object, callback?: Callback): ApiResponse

      /**
       * Gets the blogs the authenticating user follows
       *
       * @param params   - optional parameters sent with the request
       * @param callback - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      userFollowing(params?: Object, callback?: Callback): ApiResponse

      /**
       * Gets the likes for the authenticating user
       *
       * @param params   - optional parameters sent with the request
       * @param callback - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      userLikes(params?: Object, callback?: Callback): ApiResponse

      /**
       * Gets posts tagged with the specified tag
       *
       * @param tag      - tag to search for
       * @param params   - optional parameters sent with the request
       * @param callback - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       *
       */
      taggedPosts(tag?: string, params?: Object, callback?: Callback): ApiResponse

      /**
       * Creates a post on the given blog.
       * See the {@link https://www.tumblr.com/docs/api/v2#posting|API docs} for more information
       * about the parameters accepted.
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - parameters sent with the request
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      createPost(blogIdentifier: string, params: Object, callback?: Callback): ApiResponse

      /**
       * Edits a given post
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - parameters sent with the request
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      editPost(blogIdentifier: string, params: Object, callback?: Callback): ApiResponse

      /**
       * Edits a given post
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - parameters sent with the request
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      reblogPost(blogIdentifier: string, params: Object, callback?: Callback): ApiResponse

      /**
       * Edits a given post
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - parameters sent with the request
       * @param params.id      - ID of the post to delete
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      deletePost(blogIdentifier: string, params: { id: string }, callback?: Callback): ApiResponse

      /**
       * Follows a blog as the authenticating user
       *
       * @param params     - parameters sent with the request
       * @param params.url - URL of the blog to follow
       * @param callback   - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      followBlog(params: { url: string }, callback?: Callback): ApiResponse

      /**
       * Unfollows a blog as the authenticating user
       *
       * @param params     - parameters sent with the request
       * @param params.url - URL of the blog to unfollow
       * @param callback   - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      unfollowBlog(params: { url: string }, callback?: Callback): ApiResponse

      /**
       * Likes a post as the authenticating user
       *
       * @param params            - parameters sent with the request
       * @param params.id         - ID of the post to like
       * @param params.reblog_key - Reblog key for the post ID
       * @param callback          - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      likePost(params: { url: string; reblog_key: string }, callback?: Callback): ApiResponse

      /**
       * Unlikes a post as the authenticating user
       *
       * @param params            - parameters sent with the request
       * @param params.id         - ID of the post to unlike
       * @param params.reblog_key - Reblog key for the post ID
       * @param callback          - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      unlikePost(params: { url: string; reblog_key: string }, callback?: Callback): ApiResponse

      /**
       * Creates a text post on the given blog
       *
       * @see {@link https://www.tumblr.com/docs/api/v2#ptext-posts|API docs}
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - parameters sent with the request
       * @param params.title   - post title text
       * @param params.body    - post body text
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      createTextPost(blogIdentifier: string, params: { title?: string; body: string }, callback?: Callback): ApiResponse

      /**
       * Creates a photo post on the given blog
       *
       * @see {@link https://www.tumblr.com/docs/api/v2#pphoto-posts|API docs}
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - parameters sent with the request
       * @param params.source  - image source URL
       * @param params.data    - an image or array of images
       * @param params.data64  - base64-encoded image data
       * @param params.caption - post caption text
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      createPhotoPost(blogIdentifier: string, params: { source: string; data: string | string[]; data64: string; caption?: string; }, callback?: Callback): ApiResponse

      /**
       * Creates a quote post on the given blog
       *
       * @see {@link https://www.tumblr.com/docs/api/v2#pquote-posts|API docs}
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - parameters sent with the request
       * @param params.quote   - quote text
       * @param params.source  - quote source
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      createQuotePost(blogIdentifier: string, params: { quote: string; source?: string }, callback?: Callback): ApiResponse

      /**
       * Creates a link post on the given blog
       *
       * @see {@link https://www.tumblr.com/docs/api/v2#plink-posts|API docs}
       *
       * @method createLinkPost
       *
       * @param blogIdentifier     - blog name or URL
       * @param params             - parameters sent with the request
       * @param params.title       - post title text
       * @param params.url         - the link URL
       * @param params.thumbnail   - the URL of an image to use as the thumbnail
       * @param params.excerpt     - an excerpt from the page the link points to
       * @param params.author      - the name of the author of the page the link points to
       * @param params.description - post caption text
       * @param callback           - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      createLinkPost(blogIdentifier: string, params: { title?: string; url: string; thumbnail?: string; excerpt?: string; author?: string; description?: string }, callback?: Callback): ApiResponse


      /**
       * Creates a chat post on the given blog
       *
       * @see {@link https://www.tumblr.com/docs/api/v2#pchat-posts|API docs}
       *
       * @method createLinkPost
       *
       * @param blogIdentifier      - blog name or URL
       * @param params              - parameters sent with the request
       * @param params.title        - post title text
       * @param params.conversation - chat text
       * @param callback            - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      createChatPost(blogIdentifier: string, params: { title?: string; conversation: string }, callback?: Callback): ApiResponse

      /**
       * Creates a photo post on the given blog
       *
       * @see {@link https://www.tumblr.com/docs/api/v2#paudio-posts|API docs}
       *
       * @method createAudioPost
       *
       * @param blogIdentifier      - blog name or URL
       * @param params              - parameters sent with the request
       * @param params.external_url - image source URL
       * @param params.data         - an audio file
       * @param params.caption      - post caption text
       * @param callback            - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      createAudioPost(blogIdentifier: string, params: { external_url: string; data: any; caption?: string }, callback?: Callback): ApiResponse


      /**
       * Creates a photo post on the given blog
       *
       * @see {@link https://www.tumblr.com/docs/api/v2#pvideo-posts|API docs}
       *
       * @method createVideoPost
       *
       * @param blogIdentifier - blog name or URL
       * @param params         - parameters sent with the request
       * @param params.embed   - embed code or a video URL
       * @param params.data    - a video file
       * @param params.caption - post caption text
       * @param callback       - invoked when the request completes
       *
       * @return Request object, or Promise if {@link returnPromises} was used
       */
      createVideoPost(blogIdentifier: string, params: { embed: string; data: any; caption?: string }, callback: Callback): ApiResponse

      /**
       * Sets the client to return Promises instead of Request objects by patching the `getRequest` and
       * `postRequest` methods on the client
       */
      returnPromises(): void
    }

    function createClient(options?: Partial<ConstructOptions>): Client
    function createClient(credentials?: Credentials, baseUrl?: string, request?: RequestLibrary): Client
  }

  export = TumblrJs
}
