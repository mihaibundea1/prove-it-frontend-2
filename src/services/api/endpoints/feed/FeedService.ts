import { BaseApiService } from "../../core/BaseApiService";
import { Post, FeedResponse } from "./types/feed.types";
import { ApiResponse } from "../../core/types/api.types";
import { FEED_ENDPOINTS } from "./constants/feed.endpoints";

export class FeedService extends BaseApiService {
  constructor(getToken?: () => Promise<string | null>) {
    super(FEED_ENDPOINTS.BASE, getToken ?? (() => Promise.resolve(null)));
  }

  async fetchPosts(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Post[]>> {
    try {
      const response = await this.get<FeedResponse>(
        FEED_ENDPOINTS.FETCH(page, limit)
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createPost(postData: FormData): Promise<ApiResponse<Post>> {
    try {
      // Use the post method from BaseApiService
      // It will correctly handle FormData without stringify
      const response = await this.post<Post>(
        FEED_ENDPOINTS.POST,
        postData
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async likePost(
    postId: string,
    username: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await this.post<void>(
        FEED_ENDPOINTS.LIKE(postId),
        { username }
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async unlikePost(
    postId: string,
    likeId: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await this.delete<void>(
        FEED_ENDPOINTS.UNLIKE(postId, likeId)
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addComment(
    postId: string,
    username: string,
    comment: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await this.post<void>(
        FEED_ENDPOINTS.COMMENT(postId),
        { username, comment }
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteComment(
    postId: string,
    commentId: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await this.delete<void>(
        FEED_ENDPOINTS.DELETE_COMMENT(postId, commentId)
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deletePost(postId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.delete<void>(
        FEED_ENDPOINTS.DELETE_POST(postId)
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleResponse<T>(response: any): ApiResponse<T> {
    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status || 400,
      };
    }
    return {
      data: response.data,
      error: undefined,
      status: response.status || 200,
    };
  }

  private handleError(error: unknown): ApiResponse<never> {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to process feed request";
    return {
      data: null,
      error: errorMessage,
      status: 500,
    };
  }
}