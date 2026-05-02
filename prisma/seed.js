const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CSX...');

  const areaSAC = await prisma.area.upsert({
    where: { id: 'area-sac' },
    update: {},
    create: {
      id: 'area-sac',
      name: 'SAC',
      status: 'active'
    }
  });

  const areaBodega = await prisma.area.upsert({
    where: { id: 'area-bodega' },
    update: {},
    create: {
      id: 'area-bodega',
      name: 'Bodega',
      status: 'active'
    }
  });

  const areaDespacho = await prisma.area.upsert({
    where: { id: 'area-despacho' },
    update: {},
    create: {
      id: 'area-despacho',
      name: 'Despacho',
      status: 'active'
    }
  });

  const channelWeb = await prisma.claimChannel.upsert({
    where: { id: 'channel-web' },
    update: {},
    create: {
      id: 'channel-web',
      name: 'Web',
      status: 'active'
    }
  });

  const channelStore = await prisma.claimChannel.upsert({
    where: { id: 'channel-store' },
    update: {},
    create: {
      id: 'channel-store',
      name: 'Tienda',
      status: 'active'
    }
  });

  const motiveDespacho = await prisma.claimMotive.upsert({
    where: { id: 'motive-despacho' },
    update: {},
    create: {
      id: 'motive-despacho',
      name: 'Problema de despacho',
      status: 'active'
    }
  });

  const motiveProducto = await prisma.claimMotive.upsert({
    where: { id: 'motive-producto' },
    update: {},
    create: {
      id: 'motive-producto',
      name: 'Problema de producto',
      status: 'active'
    }
  });

  const statusNuevo = await prisma.claimStatus.upsert({
    where: { id: 'status-nuevo' },
    update: {},
    create: {
      id: 'status-nuevo',
      name: 'Nuevo',
      isInitial: true,
      isFinal: false,
      status: 'active'
    }
  });

  const statusRevision = await prisma.claimStatus.upsert({
    where: { id: 'status-revision' },
    update: {},
    create: {
      id: 'status-revision',
      name: 'En revision',
      isFinal: false,
      status: 'active'
    }
  });

  const statusResuelto = await prisma.claimStatus.upsert({
    where: { id: 'status-resuelto' },
    update: {},
    create: {
      id: 'status-resuelto',
      name: 'Resuelto',
      isFinal: false,
      status: 'active'
    }
  });

  const statusCerrado = await prisma.claimStatus.upsert({
    where: { id: 'status-cerrado' },
    update: {},
    create: {
      id: 'status-cerrado',
      name: 'Cerrado',
      isFinal: true,
      status: 'active'
    }
  });

  await prisma.claimStatusTransition.upsert({
    where: { id: 't1' },
    update: {},
    create: {
      id: 't1',
      name: 'Iniciar revision',
      statusFromId: statusNuevo.id,
      statusToId: statusRevision.id,
      status: 'active'
    }
  });

  await prisma.claimStatusTransition.upsert({
    where: { id: 't2' },
    update: {},
    create: {
      id: 't2',
      name: 'Resolver',
      statusFromId: statusRevision.id,
      statusToId: statusResuelto.id,
      status: 'active'
    }
  });

  await prisma.claimStatusTransition.upsert({
    where: { id: 't3' },
    update: {},
    create: {
      id: 't3',
      name: 'Cerrar',
      statusFromId: statusResuelto.id,
      statusToId: statusCerrado.id,
      status: 'active'
    }
  });

  const typeProductoFaltante = await prisma.claimType.upsert({
    where: { id: 'type-producto-faltante' },
    update: {},
    create: {
      id: 'type-producto-faltante',
      name: 'Producto faltante',
      claimMotiveId: motiveDespacho.id,
      areaInChargeId: areaDespacho.id,
      sla: 24,
      slaMeasuredIn: 'hours',
      priority: 'high',
      status: 'active'
    }
  });

  const typeProductoDanado = await prisma.claimType.upsert({
    where: { id: 'type-producto-danado' },
    update: {},
    create: {
      id: 'type-producto-danado',
      name: 'Producto danado',
      claimMotiveId: motiveProducto.id,
      areaInChargeId: areaBodega.id,
      sla: 48,
      slaMeasuredIn: 'hours',
      priority: 'medium',
      status: 'active'
    }
  });

  await prisma.claimItemResolution.upsert({
    where: { id: 'resolution-reponer' },
    update: {},
    create: {
      id: 'resolution-reponer',
      name: 'Reponer producto',
      shouldCreateOrder: true,
      shouldPickItem: true,
      status: 'active'
    }
  });

  await prisma.claimItemResolution.upsert({
    where: { id: 'resolution-credito' },
    update: {},
    create: {
      id: 'resolution-credito',
      name: 'Nota de credito',
      shouldGenerateCreditNote: true,
      status: 'active'
    }
  });

  await prisma.claimCompensation.upsert({
    where: { id: 'comp-descuento' },
    update: {},
    create: {
      id: 'comp-descuento',
      name: 'Descuento',
      isPublic: true,
      status: 'active'
    }
  });

  await prisma.claimCompensation.upsert({
    where: { id: 'comp-devolucion' },
    update: {},
    create: {
      id: 'comp-devolucion',
      name: 'Devolucion dinero',
      isPublic: true,
      status: 'active'
    }
  });

  await prisma.claimSemaphore.upsert({
    where: { id: 'sem-verde' },
    update: {},
    create: {
      id: 'sem-verde',
      name: 'En plazo',
      rangeLow: 8,
      rangeHigh: 9999,
      color: '#16A34A',
      alerts: false,
      status: 'active'
    }
  });

  await prisma.claimSemaphore.upsert({
    where: { id: 'sem-amarillo' },
    update: {},
    create: {
      id: 'sem-amarillo',
      name: 'Proximo a vencer',
      rangeLow: 2,
      rangeHigh: 8,
      color: '#F59E0B',
      alerts: true,
      status: 'active'
    }
  });

  await prisma.claimSemaphore.upsert({
    where: { id: 'sem-rojo' },
    update: {},
    create: {
      id: 'sem-rojo',
      name: 'Vencido',
      rangeLow: 0,
      rangeHigh: 2,
      color: '#DC2626',
      alerts: true,
      status: 'active'
    }
  });

  const managementContactarCliente = await prisma.claimManagement.upsert({
    where: { id: 'management-contactar-cliente' },
    update: {},
    create: {
      id: 'management-contactar-cliente',
      name: 'Contactar cliente',
      description: 'Gestion de contacto con cliente',
      status: 'active'
    }
  });

  await prisma.claimManagementStatus.upsert({
    where: { id: 'management-status-pendiente' },
    update: {},
    create: {
      id: 'management-status-pendiente',
      name: 'Pendiente',
      description: 'Gestion pendiente',
      claimManagementId: managementContactarCliente.id,
      status: 'active'
    }
  });

  await prisma.area.upsert({
    where: { id: 'area-finanzas' },
    update: {},
    create: {
      id: 'area-finanzas',
      name: 'Finanzas',
      status: 'active'
    }
  });

  await prisma.area.upsert({
    where: { id: 'area-postventa' },
    update: {},
    create: {
      id: 'area-postventa',
      name: 'Postventa',
      status: 'active'
    }
  });

  await prisma.area.upsert({
    where: { id: 'area-venta-empresa' },
    update: {},
    create: {
      id: 'area-venta-empresa',
      name: 'Venta empresa',
      status: 'active'
    }
  });

  await prisma.claimChannel.upsert({
    where: { id: 'channel-marketplace' },
    update: {},
    create: {
      id: 'channel-marketplace',
      name: 'Marketplace',
      description: 'Mercado Libre, Falabella u otro marketplace',
      status: 'active'
    }
  });

  await prisma.claimChannel.upsert({
    where: { id: 'channel-sales-rep' },
    update: {},
    create: {
      id: 'channel-sales-rep',
      name: 'Vendedor',
      description: 'Reclamo ingresado por vendedor o venta empresa',
      status: 'active'
    }
  });

  const motiveVenta = await prisma.claimMotive.upsert({
    where: { id: 'motive-venta' },
    update: {},
    create: {
      id: 'motive-venta',
      name: 'Problema de venta o cobro',
      status: 'active'
    }
  });

  const motivePostventa = await prisma.claimMotive.upsert({
    where: { id: 'motive-postventa' },
    update: {},
    create: {
      id: 'motive-postventa',
      name: 'Postventa',
      status: 'active'
    }
  });

  const statusEsperandoCliente = await prisma.claimStatus.upsert({
    where: { id: 'status-esperando-cliente' },
    update: {},
    create: {
      id: 'status-esperando-cliente',
      name: 'Esperando informacion del cliente',
      isFinal: false,
      isNotifiable: true,
      status: 'active'
    }
  });

  const statusEsperandoBodega = await prisma.claimStatus.upsert({
    where: { id: 'status-esperando-bodega' },
    update: {},
    create: {
      id: 'status-esperando-bodega',
      name: 'Esperando bodega',
      isFinal: false,
      status: 'active'
    }
  });

  const statusEsperandoDespacho = await prisma.claimStatus.upsert({
    where: { id: 'status-esperando-despacho' },
    update: {},
    create: {
      id: 'status-esperando-despacho',
      name: 'Esperando despacho',
      isFinal: false,
      status: 'active'
    }
  });

  const statusEsperandoFinanzas = await prisma.claimStatus.upsert({
    where: { id: 'status-esperando-finanzas' },
    update: {},
    create: {
      id: 'status-esperando-finanzas',
      name: 'Esperando finanzas',
      isFinal: false,
      status: 'active'
    }
  });

  const statusResolucionAprobada = await prisma.claimStatus.upsert({
    where: { id: 'status-resolucion-aprobada' },
    update: {},
    create: {
      id: 'status-resolucion-aprobada',
      name: 'Resolucion aprobada',
      isFinal: false,
      isNotifiable: true,
      status: 'active'
    }
  });

  const statusReposicionSolicitada = await prisma.claimStatus.upsert({
    where: { id: 'status-reposicion-solicitada' },
    update: {},
    create: {
      id: 'status-reposicion-solicitada',
      name: 'Reposicion solicitada',
      isFinal: false,
      isNotifiable: true,
      status: 'active'
    }
  });

  const statusNotaCreditoSolicitada = await prisma.claimStatus.upsert({
    where: { id: 'status-nota-credito-solicitada' },
    update: {},
    create: {
      id: 'status-nota-credito-solicitada',
      name: 'Nota de credito solicitada',
      isFinal: false,
      isNotifiable: true,
      status: 'active'
    }
  });

  const statusRechazado = await prisma.claimStatus.upsert({
    where: { id: 'status-rechazado' },
    update: {},
    create: {
      id: 'status-rechazado',
      name: 'Rechazado',
      isFinal: true,
      isNotifiable: true,
      status: 'active'
    }
  });

  const extraTransitions = [
    {
      id: 't-esperar-cliente',
      name: 'Esperar informacion del cliente',
      statusFromId: statusRevision.id,
      statusToId: statusEsperandoCliente.id
    },
    {
      id: 't-esperar-bodega',
      name: 'Esperar bodega',
      statusFromId: statusRevision.id,
      statusToId: statusEsperandoBodega.id
    },
    {
      id: 't-esperar-despacho',
      name: 'Esperar despacho',
      statusFromId: statusRevision.id,
      statusToId: statusEsperandoDespacho.id
    },
    {
      id: 't-esperar-finanzas',
      name: 'Esperar finanzas',
      statusFromId: statusRevision.id,
      statusToId: statusEsperandoFinanzas.id
    },
    {
      id: 't-bodega-aprueba',
      name: 'Bodega aprueba resolucion',
      statusFromId: statusEsperandoBodega.id,
      statusToId: statusResolucionAprobada.id
    },
    {
      id: 't-despacho-aprueba',
      name: 'Despacho aprueba resolucion',
      statusFromId: statusEsperandoDespacho.id,
      statusToId: statusResolucionAprobada.id
    },
    {
      id: 't-finanzas-aprueba',
      name: 'Finanzas aprueba resolucion',
      statusFromId: statusEsperandoFinanzas.id,
      statusToId: statusResolucionAprobada.id
    },
    {
      id: 't-solicitar-reposicion',
      name: 'Solicitar reposicion',
      statusFromId: statusResolucionAprobada.id,
      statusToId: statusReposicionSolicitada.id
    },
    {
      id: 't-solicitar-nota-credito',
      name: 'Solicitar nota de credito',
      statusFromId: statusResolucionAprobada.id,
      statusToId: statusNotaCreditoSolicitada.id
    },
    {
      id: 't-reposicion-resuelta',
      name: 'Reposicion resuelta',
      statusFromId: statusReposicionSolicitada.id,
      statusToId: statusResuelto.id
    },
    {
      id: 't-nota-credito-resuelta',
      name: 'Nota de credito resuelta',
      statusFromId: statusNotaCreditoSolicitada.id,
      statusToId: statusResuelto.id
    },
    {
      id: 't-rechazar',
      name: 'Rechazar reclamo',
      statusFromId: statusRevision.id,
      statusToId: statusRechazado.id
    },
    {
      id: 't-cerrar-rechazado',
      name: 'Cerrar rechazado',
      statusFromId: statusRechazado.id,
      statusToId: statusCerrado.id
    }
  ];

  for (const transition of extraTransitions) {
    await prisma.claimStatusTransition.upsert({
      where: { id: transition.id },
      update: {},
      create: {
        ...transition,
        status: 'active'
      }
    });
  }

  await prisma.claimType.upsert({
    where: { id: 'type-atraso-despacho' },
    update: {},
    create: {
      id: 'type-atraso-despacho',
      name: 'Atraso despacho',
      claimMotiveId: motiveDespacho.id,
      areaInChargeId: 'area-despacho',
      sla: 12,
      slaMeasuredIn: 'hours',
      priority: 'high',
      affectedProcessesJson: JSON.stringify(['Delivery', 'Notification']),
      compensationsJson: JSON.stringify(['comp-descuento']),
      status: 'active'
    }
  });

  await prisma.claimType.upsert({
    where: { id: 'type-cobro-incorrecto' },
    update: {},
    create: {
      id: 'type-cobro-incorrecto',
      name: 'Cobro incorrecto',
      claimMotiveId: motiveVenta.id,
      areaInChargeId: 'area-finanzas',
      sla: 72,
      slaMeasuredIn: 'hours',
      priority: 'medium',
      affectedProcessesJson: JSON.stringify(['Finance', 'OMS']),
      compensationsJson: JSON.stringify(['comp-devolucion']),
      status: 'active'
    }
  });

  await prisma.claimType.upsert({
    where: { id: 'type-cambio-producto' },
    update: {},
    create: {
      id: 'type-cambio-producto',
      name: 'Cambio de producto',
      claimMotiveId: motivePostventa.id,
      areaInChargeId: 'area-postventa',
      sla: 5,
      slaMeasuredIn: 'days',
      priority: 'low',
      affectedProcessesJson: JSON.stringify(['Inventory', 'OMS', 'Delivery']),
      compensationsJson: JSON.stringify(['comp-despacho-gratis']),
      status: 'active'
    }
  });

  await prisma.claimType.upsert({
    where: { id: 'type-devolucion-nota-credito' },
    update: {},
    create: {
      id: 'type-devolucion-nota-credito',
      name: 'Devolucion con nota de credito',
      claimMotiveId: motivePostventa.id,
      areaInChargeId: 'area-finanzas',
      sla: 7,
      slaMeasuredIn: 'days',
      priority: 'medium',
      affectedProcessesJson: JSON.stringify(['Delivery', 'Finance']),
      compensationsJson: JSON.stringify(['comp-devolucion']),
      status: 'active'
    }
  });

  await prisma.claimType.upsert({
    where: { id: 'type-venta-empresa-despacho' },
    update: {},
    create: {
      id: 'type-venta-empresa-despacho',
      name: 'Venta empresa con problema de despacho',
      claimMotiveId: motiveDespacho.id,
      areaInChargeId: 'area-venta-empresa',
      sla: 24,
      slaMeasuredIn: 'hours',
      priority: 'high',
      affectedProcessesJson: JSON.stringify(['OMS', 'Finance', 'Delivery']),
      compensationsJson: JSON.stringify(['comp-devolucion', 'comp-despacho-gratis']),
      status: 'active'
    }
  });

  await prisma.claimType.upsert({
    where: { id: 'type-marketplace-no-entregado' },
    update: {},
    create: {
      id: 'type-marketplace-no-entregado',
      name: 'Marketplace producto no entregado',
      claimMotiveId: motiveDespacho.id,
      areaInChargeId: 'area-despacho',
      sla: 12,
      slaMeasuredIn: 'hours',
      priority: 'urgent',
      affectedProcessesJson: JSON.stringify(['OMS', 'Delivery', 'Finance']),
      compensationsJson: JSON.stringify(['comp-devolucion']),
      status: 'active'
    }
  });

  await prisma.claimItemResolution.upsert({
    where: { id: 'resolution-devolucion' },
    update: {},
    create: {
      id: 'resolution-devolucion',
      name: 'Devolucion dinero',
      shouldGenerateCreditNote: true,
      status: 'active'
    }
  });

  await prisma.claimItemResolution.upsert({
    where: { id: 'resolution-garantia-proveedor' },
    update: {},
    create: {
      id: 'resolution-garantia-proveedor',
      name: 'Derivar a garantia proveedor',
      shouldCreateOrder: false,
      shouldPickItem: false,
      shouldGenerateCreditNote: false,
      status: 'active'
    }
  });

  await prisma.claimCompensation.upsert({
    where: { id: 'comp-despacho-gratis' },
    update: {},
    create: {
      id: 'comp-despacho-gratis',
      name: 'Despacho gratis',
      isPublic: true,
      status: 'active'
    }
  });

  await prisma.claimCompensation.upsert({
    where: { id: 'comp-gift-card' },
    update: {},
    create: {
      id: 'comp-gift-card',
      name: 'Gift card',
      hasComment: true,
      isPublic: true,
      status: 'active'
    }
  });

  console.log('Seed completado');
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
