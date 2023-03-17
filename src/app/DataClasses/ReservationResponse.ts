import {Show} from './Show';
import {Reservation} from './Reservation';

export class ReservationResponse{
    show: Show;
    reservation: Reservation;
    tickets: string[];
}
