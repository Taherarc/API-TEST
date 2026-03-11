/**
 * Modulo de transformacion de datos para operaciones de busqueda local.
 */

/**
 * Ejecuta un filtrado predictivo sobre una coleccion de datos geograficos.
 * Busca coincidencias parciales en nombres y codigos internacionales.
 *
 * Parámetros:
 *   data (T[]): Arreglo genérico de objetos a ser filtrados.
 *   searchTerm (string): Termino de búsqueda proporcionado por el usuario.
 *
 * Retorna:
 *   T[]: Subconjunto de elementos que cumplen con los criterios de busqueda.
 */
export const filterGeoData = <T extends any>(data: T[], searchTerm: string): T[] => {
  // Retorna la totalidad de los datos si no existe una cadena de busqueda activa.
  if (!searchTerm) return data;
  
  // Normaliza el termino a minusculas para comparaciones insensibles a mayusculas.
  const lowerTerm = searchTerm.toLowerCase();

  return data.filter((item: any) => {
    // Comprueba coincidencia en la propiedad 'name'.
    const nameMatch = item.name?.toLowerCase().includes(lowerTerm);
    
    // Comprueba coincidencia en diversos codigos de identificacion segun la entidad.
    const isoMatch = 
      item.iso2?.toLowerCase().includes(lowerTerm) || 
      item.country_code?.toLowerCase().includes(lowerTerm) || 
      item.state_code?.toLowerCase().includes(lowerTerm);
    
    return nameMatch || isoMatch;
  });
};
