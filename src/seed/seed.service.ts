import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { forEach, size } from 'lodash';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  async executeSeed() {
    const { data } = await axios.get<PokeResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=650`,
    );

    forEach(data.results, ({ name, url }) => {
      const segments = url.split('/');
      const nro = Number(segments[size(segments) - 2]);
      console.log(name, nro);
    });
    return data.results;
  }
}
