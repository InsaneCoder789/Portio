/** Shortest signed distance in a looping deck. */
export function carouselOffset(index: number, active: number, count: number) {
  const distance = (index - active + count) % count;
  return distance > count / 2 ? distance - count : distance;
}
