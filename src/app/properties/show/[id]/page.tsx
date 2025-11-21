"use client";

import { Show } from "@refinedev/antd";
import { useParams } from "next/navigation";
import { Typography, Row, Col, Card, Tag, Descriptions, Image, Space, Spin } from "antd";
import {
  HomeOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ExpandOutlined,
} from "@ant-design/icons";
import { supabaseBrowserClient } from "@utils/supabase/client";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

export default function PropertyShow() {
  const params = useParams();
  const id = params?.id as string;
  
  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      const { data, error } = await supabaseBrowserClient
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error cargando propiedad:", error);
        setError(error);
      } else {
        console.log("✅ Propiedad cargada:", data);
        setRecord(data);
      }
      
      setIsLoading(false);
    };
    
    fetchProperty();
  }, [id]);

  const typeLabels: Record<string, string> = {
    house: "Casa",
    apartment: "Departamento",
    office: "Oficina",
    lot: "Lote/Terreno",
  };

  const statusLabels: Record<string, string> = {
    available: "Disponible",
    reserved: "Reservada",
    sold: "Vendida",
  };

  const statusColors: Record<string, string> = {
    available: "success",
    reserved: "warning",
    sold: "error",
  };

  if (!id) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Text type="danger">ID de propiedad no encontrado</Text>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" tip="Cargando propiedad..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Text type="danger">Error al cargar la propiedad: {error.message}</Text>
      </div>
    );
  }

  if (!record) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Text type="warning">No se encontró la propiedad</Text>
      </div>
    );
  }

  return (
    <Show isLoading={isLoading}>
      <Row gutter={[16, 16]}>
        {/* Imágenes */}
        {record?.images && record.images.length > 0 && (
          <Col span={24}>
            <Card>
              <Image.PreviewGroup>
                <Row gutter={[8, 8]}>
                  {record.images.map((img: string, idx: number) => (
                    <Col span={idx === 0 ? 24 : 8} key={idx}>
                      <Image
                        src={img}
                        alt={`${record.name} - ${idx + 1}`}
                        style={{
                          width: "100%",
                          height: idx === 0 ? "400px" : "200px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        fallback="https://placehold.co/800x600/e2e8f0/64748b?text=Sin+Imagen"
                      />
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            </Card>
          </Col>
        )}

        {/* Información Principal */}
        <Col span={24}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16, flexWrap: "wrap", gap: 16 }}>
              <div>
                <Title level={2} style={{ marginBottom: 8 }}>
                  {record?.name || "Sin nombre"}
                </Title>
                <Space size="large" wrap>
                  {record?.type && (
                    <Tag color="blue" icon={<HomeOutlined />}>
                      {typeLabels[record.type] || record.type}
                    </Tag>
                  )}
                  {record?.status && (
                    <Tag color={statusColors[record.status]}>
                      {statusLabels[record.status]}
                    </Tag>
                  )}
                  {record?.featured && <Tag color="gold">⭐ Destacada</Tag>}
                </Space>
              </div>
              {record?.price && (
                <Title level={2} style={{ color: "#1890ff", margin: 0 }}>
                  <DollarOutlined /> ${record.price.toLocaleString('es-MX')} MXN
                </Title>
              )}
            </div>

            {record?.description && (
              <Text style={{ fontSize: 16, display: "block", marginTop: 16 }}>
                {record.description}
              </Text>
            )}
          </Card>
        </Col>

        {/* Características */}
        <Col xs={24} md={12}>
          <Card title="🏠 Características">
            <Descriptions column={1} bordered size="small">
              {record?.bedrooms !== null && record?.bedrooms !== undefined && (
                <Descriptions.Item label="Recámaras">
                  <strong>{record.bedrooms}</strong>
                </Descriptions.Item>
              )}
              {record?.bathrooms !== null && record?.bathrooms !== undefined && (
                <Descriptions.Item label="Baños Completos">
                  <strong>{record.bathrooms}</strong>
                </Descriptions.Item>
              )}
              {record?.half_bathrooms !== null && record?.half_bathrooms !== undefined && (
                <Descriptions.Item label="Medios Baños">
                  <strong>{record.half_bathrooms}</strong>
                </Descriptions.Item>
              )}
              {record?.parking_spots !== null && record?.parking_spots !== undefined && (
                <Descriptions.Item label="Estacionamientos">
                  <strong>{record.parking_spots}</strong>
                </Descriptions.Item>
              )}
              {record?.subtype && (
                <Descriptions.Item label="Subtipo">
                  {record.subtype}
                </Descriptions.Item>
              )}
              {record?.property_condition && (
                <Descriptions.Item label="Condición">
                  {record.property_condition === "new" ? "Nueva" : 
                   record.property_condition === "resale" ? "Reventa" : 
                   "En Construcción"}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Áreas */}
        <Col xs={24} md={12}>
          <Card title="📐 Áreas">
            <Descriptions column={1} bordered size="small">
              {record?.area?.total && (
                <Descriptions.Item label="Área Total">
                  <strong><ExpandOutlined /> {record.area.total} m²</strong>
                </Descriptions.Item>
              )}
              {record?.area?.interior && (
                <Descriptions.Item label="Área Interior">
                  {record.area.interior} m²
                </Descriptions.Item>
              )}
              {record?.area?.terrace && (
                <Descriptions.Item label="Terraza">
                  {record.area.terrace} m²
                </Descriptions.Item>
              )}
              {record?.area?.land && (
                <Descriptions.Item label="Terreno">
                  {record.area.land} m²
                </Descriptions.Item>
              )}
              {record?.area?.construction && (
                <Descriptions.Item label="Construcción">
                  {record.area.construction} m²
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Ubicación */}
        <Col span={24}>
          <Card title="📍 Ubicación">
            <Descriptions column={2} bordered>
              {record?.location?.development && (
                <Descriptions.Item label="Desarrollo">
                  <strong>{record.location.development}</strong>
                </Descriptions.Item>
              )}
              {record?.location?.city && (
                <Descriptions.Item label="Ciudad">
                  {record.location.city}
                </Descriptions.Item>
              )}
              {record?.location?.state && (
                <Descriptions.Item label="Estado">
                  {record.location.state}
                </Descriptions.Item>
              )}
              {record?.location?.neighborhood && (
                <Descriptions.Item label="Colonia/Zona">
                  {record.location.neighborhood}
                </Descriptions.Item>
              )}
              {record?.address && (
                <Descriptions.Item label="Dirección" span={2}>
                  <EnvironmentOutlined /> {record.address}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Amenidades */}
        {record?.amenities && record.amenities.length > 0 && (
          <Col span={24}>
            <Card title="✨ Amenidades">
              <Row gutter={[8, 8]}>
                {record.amenities.map((amenity: string, idx: number) => (
                  <Col key={idx}>
                    <Tag color="blue">{amenity}</Tag>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        )}

        {/* Información Adicional */}
        <Col span={24}>
          <Card title="ℹ️ Información Adicional">
            <Descriptions column={2} bordered size="small">
              {record?.property_id && (
                <Descriptions.Item label="ID de Propiedad">
                  {record.property_id}
                </Descriptions.Item>
              )}
              {record?.operation_type && (
                <Descriptions.Item label="Tipo de Operación">
                  {record.operation_type === "sale" ? "Venta" : 
                   record.operation_type === "rent" ? "Renta" : "Venta/Renta"}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Moneda">
                {record?.currency || "MXN"}
              </Descriptions.Item>
              <Descriptions.Item label="Publicada">
                {record?.published ? "Sí" : "No"}
              </Descriptions.Item>
              {record?.created_at && (
                <Descriptions.Item label="Fecha de Creación">
                  {new Date(record.created_at).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Descriptions.Item>
              )}
              {record?.updated_at && (
                <Descriptions.Item label="Última Actualización">
                  {new Date(record.updated_at).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </Show>
  );
}