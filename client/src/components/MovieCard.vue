<script setup lang="ts">
import type { FeedMovie } from '@/types'

defineProps<{
  movie: FeedMovie
}>()
</script>

<template>
  <van-cell-group inset style="margin-bottom: 12px">
    <van-cell center>
      <template #icon>
        <van-image
          v-if="movie.posterPath"
          :src="`https://image.tmdb.org/t/p/w154${movie.posterPath}`"
          width="80"
          height="120"
          radius="4"
          fit="cover"
          style="margin-right: 12px"
        />
      </template>
      <template #title>
        <span style="font-weight: 600">{{ movie.title }}</span>
      </template>
      <template #label>
        <div style="margin-top: 4px">
          <van-rate
            :model-value="movie.voteAverage / 2"
            allow-half
            readonly
            size="12"
            void-icon="star"
          />
          <span style="font-size: 12px; margin-left: 4px; color: #999">
            {{ (movie.voteAverage / 2).toFixed(1) }}
          </span>
        </div>
        <div v-if="movie.genres.length" style="margin-top: 4px">
          <van-tag
            v-for="genre in movie.genres"
            :key="genre.name"
            plain
            type="primary"
            size="medium"
            style="margin-right: 4px; margin-bottom: 4px"
          >
            {{ genre.name }}
          </van-tag>
        </div>
        <p
          style="
            margin-top: 4px;
            font-size: 12px;
            color: #666;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          "
        >
          {{ movie.overview }}
        </p>
      </template>
    </van-cell>
  </van-cell-group>
</template>
