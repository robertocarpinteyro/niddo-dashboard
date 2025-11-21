"use client";

import { useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";

export default function PropertyList() {
  const { show, edit } = useNavigation();
  const { tableProps } = useTable({
    resource: "properties",
    pagination: {
      pageSize: 10,
    },
  });

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
        <h1>🏠 Propiedades</h1>
        <Button type="primary" href="/properties/create">
          + Nueva Propiedad
        </Button>
      </div>

      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="images"
          title="Imagen"
          render={(images: string[]) => (
            images?.[0] ? (
              <img
                src={images[0]}
                alt="Property"
                style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 4 }}
              />
            ) : (
              <div style={{ width: 80, height: 60, background: "#f0f0f0", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                🏠
              </div>
            )
          )}
        />
        
        <Table.Column dataIndex="name" title="Nombre" />
        
        <Table.Column
          dataIndex="type"
          title="Tipo"
          render={(type: string) => {
            const types: Record<string, { label: string; color: string }> = {
              house: { label: "Casa", color: "blue" },
              apartment: { label: "Departamento", color: "green" },
              office: { label: "Oficina", color: "orange" },
              lot: { label: "Lote", color: "purple" },
            };
            const typeInfo = types[type] || { label: type, color: "default" };
            return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>;
          }}
        />
        
        <Table.Column
          dataIndex="price"
          title="Precio"
          render={(price: number) => 
            price ? `$${price.toLocaleString('es-MX')} MXN` : "Consultar"
          }
        />
        
        <Table.Column
          dataIndex="bedrooms"
          title="Recámaras"
          render={(bedrooms: number) => bedrooms || "-"}
        />
        
        <Table.Column
          dataIndex="status"
          title="Estado"
          render={(status: string) => {
            const colors: Record<string, string> = {
              available: "success",
              reserved: "warning",
              sold: "error",
            };
            const labels: Record<string, string> = {
              available: "Disponible",
              reserved: "Reservada",
              sold: "Vendida",
            };
            return <Tag color={colors[status]}>{labels[status]}</Tag>;
          }}
        />
        
        <Table.Column
          dataIndex="featured"
          title="Destacada"
          render={(featured: boolean) => 
            featured ? <Tag color="gold">⭐ Destacada</Tag> : null
          }
        />
        
        <Table.Column
          title="Acciones"
          render={(_, record: any) => (
            <Space>
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => show("properties", record.id)}
              >
                Ver
              </Button>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => edit("properties", record.id)}
              >
                Editar
              </Button>
            </Space>
          )}
        />
      </Table>
    </div>
  );
}