import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {
  // id: string //! MONGO ID
  @Prop({
    unique: true,
    index: true,
  })
  name: string;
  @Prop({
    unique: true,
    index: true,
  })
  nro: string;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
