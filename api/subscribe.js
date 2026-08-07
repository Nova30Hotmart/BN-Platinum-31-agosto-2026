export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo no permitido' });
  }

  const { nombre, email } = req.body;

  if (!email || !nombre) {
    return res.status(400).json({ error: 'Nombre y correo son obligatorios.' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          NOMBRE_COMPLETO: nombre 
        },
        listIds: [parseInt(process.env.BREVO_LIST_ID, 10)],
        updateEnabled: true
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al comunicarse con Brevo.');
    }

    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: 'Error interno al procesar el registro.' });
  }
}