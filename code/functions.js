//funktion för öppning och stängning av kundkorg
export function toggelCart(cart) {
   cart.classList.add("open");

   setTimeout(function () {
      cart.classList.remove("open");
   }, 3000);
}
