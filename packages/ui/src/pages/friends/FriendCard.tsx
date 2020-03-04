import React from 'react';
import cx from 'classnames';
import Button from '../../Button';
import Stack from '../../layout/Stack';
import CircleSilhouette from './CircleSilhouette';
import Flag from '../../icons/Flag';
import Calendar from '../../icons/Calendar';
import ThinLogo from '../../icons/ThinLogo';
import './FriendCard.css';

interface Props {
  className?: string;
  gender: 'male' | 'female';
  name: string;
  born?: number;
  died?: number;
  region: string;
  numBooks: number;
  url: string;
  featured?: boolean;
  bgColor: string;
  fgColor: string;
}

const FriendCard: React.FC<Props> = ({
  className,
  gender,
  born,
  died,
  numBooks,
  region,
  bgColor,
  fgColor,
  name,
  url,
  featured = false,
}) => {
  const textColorClass = `text-${featured ? fgColor : bgColor}`;
  const buttonBgColor = bgColor.replace(/^fl/, '') as any;
  return (
    <Stack
      space="8"
      className={cx(
        className,
        textColorClass,
        'FriendCard flex flex-col items-center',
        'md:flex-row md:justify-center md:pt-12 md:pb-6',
        {
          [`bg-${bgColor}`]: featured,
          'FriendCard--featured': featured,
          'FriendCard--not-featured': !featured,
        },
      )}
    >
      <div className="md:order-2 md:flex flex-col items-center">
        <CircleSilhouette gender={gender} fgColor={fgColor} bgColor={bgColor} />
        <Button
          to={url}
          width={220}
          className={cx('box-content hidden md:block md:mt-6', {
            'border-2 border-white': featured,
          })}
          bg={buttonBgColor}
        >
          Learn More
        </Button>
      </div>
      <div className="md:mr-16 md:self-stretch md:flex md:flex-col md:justify-center">
        <h3 className="sans-wide text-2xl -mt-2 text-center mb-6 md:mb-10">{name}</h3>
        <Stack space="4" el="ul" className={cx('body-text pb-2', textColorClass)}>
          <Item Icon={Calendar}>{lifespan(born, died)}</Item>
          <Item Icon={Flag}>{region}</Item>
          <Item Icon={ThinLogo}>
            {numBooks} book{numBooks > 1 ? 's' : ''} available
          </Item>
        </Stack>
      </div>
      <Button
        to={url}
        width={220}
        className={cx('box-content md:hidden', {
          'border-4 border-white': featured,
        })}
        bg={buttonBgColor}
      >
        Learn More
      </Button>
    </Stack>
  );
};

export default FriendCard;

const Item: React.FC<{ Icon: typeof Calendar; className?: string }> = ({
  Icon,
  children,
  className,
}) => (
  <li className={cx(className, 'flex items-center')}>
    <Icon className="mr-4" height={22} /> {children}
  </li>
);

function lifespan(born?: number, died?: number): string {
  if (!born && !died) return 'Unknown';
  if (!born) return `d. ${died}`;
  if (!died) return `b. ${died}`;
  return [born, died].join(' — ');
}
