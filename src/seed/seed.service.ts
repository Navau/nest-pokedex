import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { map, size } from 'lodash';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}
  async executeSeed() {
    const data = await this.http.get<PokeResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=650`,
    );

    // const insertPromisesArray = [];

    const pokemons = map(data.results, ({ name, url }) => {
      const segments = url.split('/');
      const nro = Number(segments[size(segments) - 2]);
      // insertPromisesArray.push(this.pokemonModel.create({ name, nro }));
      return { name, nro };
    });

    // await Promise.all(insertPromisesArray);

    try {
      await this.pokemonModel.deleteMany();
      return await this.pokemonModel.insertMany(pokemons);
    } catch (err) {
      this.handleExceptions(err);
    }
  }
  private handleExceptions(err: any) {
    if (err.code === 11000)
      throw new BadRequestException(
        `Pokemon ${JSON.stringify(err.keyValue)} already exists in the DB`,
      );
    else
      throw new InternalServerErrorException(
        `Can't update Pokemon - Check server logs`,
      );
  }
}
