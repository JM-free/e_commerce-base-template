export const confirmationEmailTemplate = ({
  name,
  orderID,
  total,
  itemsHtml,
}: {
  name: string
  orderID: string
  total: number
  itemsHtml: string
}): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; line-height: 1.6; color: #333; }
    .container { padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 5px; }
    .header { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #000; }
    .order-info { margin-bottom: 20px; }
    .items { margin-bottom: 20px; }
    .items ul { padding-left: 20px; }
    .footer { margin-top: 30px; font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 10px; }
    .button { display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">¡Gracias por tu compra!</div>
    <div class="order-info">
      <p>Hola ${name},</p>
      <p>Hemos recibido tu pedido <strong>#${orderID}</strong> y ya lo estamos procesando.</p>
    </div>
    <div class="items">
      <h3>Detalles del pedido:</h3>
      <ul>
        ${itemsHtml}
      </ul>
    </div>
    <p>Puedes ver el estado de tu pedido y descargar tus productos digitales en tu cuenta:</p>
    <a href="https://culicula.com/account/purchases" class="button">Ver mis compras</a>
    <div class="footer">
      <p>Si tienes alguna pregunta, responde a este correo.</p>
      <p>&copy; ${new Date().getFullYear()} Culiculá</p>
    </div>
  </div>
</body>
</html>
  `
}
