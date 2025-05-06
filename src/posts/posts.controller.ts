import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './create-post.dto';
import { Post as PostEntity } from './post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Delete(':id')
  @HttpCode(204) // No Content
  async remove(@Param('id') id: string): Promise<void> {
    await this.postsService.remove(id);
  }
}
