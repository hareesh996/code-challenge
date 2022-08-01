import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TDailyWeatherForecast {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lon: number;

  @Column()
  lat: number;

  @Column({ type: 'date' })
  forecastDate: Date;

  @OneToMany((type) => TTemperature, (temperature) => temperature.dailyWeatherForecast, {
    cascade: true,
  })
  temperature: Array<TTemperature>;
}

@Entity()
export class TTemperature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  celsTemperature: number;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne((type) => TDailyWeatherForecast, (dailyWeather) => dailyWeather.temperature)
  dailyWeatherForecast: TDailyWeatherForecast;
}
