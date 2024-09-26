// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleKeyDown = (event: any) => {
  const regex = /[^\w\s]/g;

  if (regex.test(event.key)) {
    event.preventDefault();
  }
};
