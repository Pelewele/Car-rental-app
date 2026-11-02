import type { Car } from "../../types";
import { Icon } from "./Icon";
import { Badge } from "./Badge";

export function CarCard({
  car,
  onClick,
  horizontal = false,
}: {
  car: Car;
  onClick?: () => void;
  horizontal?: boolean;
}) {
  return (
    <button className={`car-card ${horizontal ? "horizontal" : ""}`} onClick={onClick}>
      <div className="car-img">
        <img src={car.images[0]} alt={`${car.name} in Accra`} loading="lazy" />
        <span className="demo-label">ACCRA DEMO</span>
        <span className="heart" aria-label="Save to favourites">
          <Icon name="heart" size={17} />
        </span>
      </div>
      <div className="car-info">
        <div className="car-title">
          <div>
            <small>{car.type} · {car.modelYear}</small>
            <h3>{car.name}</h3>
          </div>
          <div className="price">
            <strong>GH₵{car.pricePerDay}</strong>
            <small>/day</small>
          </div>
        </div>
        <p>
          <Icon name="pin" size={14} /> {car.neighborhood} · {car.distanceKm} km
        </p>
        <div className="car-meta">
          <Badge>Verified car</Badge>
          <span>{car.transmission}</span>
          <span>{car.seats} seats</span>
          <span>★ {car.rating} ({car.reviewCount})</span>
        </div>
      </div>
    </button>
  );
}
