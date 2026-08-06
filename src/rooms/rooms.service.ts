import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { Seat } from './entities/seat.entity';

interface CreateRoomInput {
  name: string;
  rows: number; // e.g. 8 -> rows A..H
  seatsPerRow: number; // e.g. 10 -> seats 1..10
}

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepo: Repository<Room>,
    @InjectRepository(Seat)
    private readonly seatsRepo: Repository<Seat>,
  ) {}

  findAll(): Promise<Room[]> {
    return this.roomsRepo.find();
  }

  async findById(id: string): Promise<Room> {
    const room = await this.roomsRepo.findOne({
      where: { id },
      relations: { seats: true },
    });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  // generates a rectangular grid of seats once, at room-creation time
  async create(input: CreateRoomInput): Promise<Room> {
    const room = this.roomsRepo.create({
      name: input.name,
      capacity: input.rows * input.seatsPerRow,
    });
    await this.roomsRepo.save(room);

    const seats: Seat[] = [];
    for (let r = 0; r < input.rows; r++) {
      const rowLabel = String.fromCharCode('A'.charCodeAt(0) + r);
      for (let n = 1; n <= input.seatsPerRow; n++) {
        seats.push(
          this.seatsRepo.create({ roomId: room.id, row: rowLabel, number: n }),
        );
      }
    }
    await this.seatsRepo.save(seats);

    return this.findById(room.id);
  }
}
