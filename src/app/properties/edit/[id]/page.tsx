"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, InputNumber, Switch, Row, Col } from "antd";
import { useEffect } from "react";

export default function PropertyEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    action: "edit",
    resource: "properties",
  });

  // Convertir arrays a texto cuando se carga el formulario
  useEffect(() => {
    if (queryResult?.data?.data) {
      const record = queryResult.data.data;

      // Convertir images array a texto
      if (record.images && Array.isArray(record.images)) {
        formProps.form?.setFieldValue('images', record.images.join('\n'));
      }

      // Convertir amenities array a texto
      if (record.amenities && Array.isArray(record.amenities)) {
        formProps.form?.setFieldValue('amenities', record.amenities.join('\n'));
      }

      // Convertir floor_plans array a texto
      if (record.floor_plans && Array.isArray(record.floor_plans)) {
        formProps.form?.setFieldValue('floor_plans', record.floor_plans.join('\n'));
      }
    }
  }, [queryResult?.data?.data]);

  // Procesar datos antes de enviar
  const customFormProps = {
    ...formProps,
    onFinish: (values: any) => {
      // Convertir images de texto a array
      if (values.images && typeof values.images === 'string') {
        values.images = values.images
          .split('\n')
          .map((url: string) => url.trim())
          .filter((url: string) => url.length > 0);
      }

      // Convertir amenities de texto a array
      if (values.amenities && typeof values.amenities === 'string') {
        values.amenities = values.amenities
          .split('\n')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0);
      }

      // Convertir floor_plans de texto a array
      if (values.floor_plans && typeof values.floor_plans === 'string') {
        values.floor_plans = values.floor_plans
          .split('\n')
          .map((url: string) => url.trim())
          .filter((url: string) => url.length > 0);
      }

      // Llamar al onFinish original
      formProps.onFinish?.(values);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...customFormProps} layout="vertical">
        <Row gutter={16}>
          {/* Columna Izquierda */}
          <Col span={12}>
            <h3>📋 Información Básica</h3>
            
            <Form.Item
              label="ID de Propiedad"
              name="property_id"
              rules={[{ required: true, message: "Requerido" }]}
            >
              <Input placeholder="ej: blue-tipo-a" />
            </Form.Item>

            <Form.Item
              label="Nombre"
              name="name"
              rules={[{ required: true, message: "Requerido" }]}
            >
              <Input placeholder="ej: Blue - Departamento Tipo A" />
            </Form.Item>

            <Form.Item
              label="Tipo"
              name="type"
              rules={[{ required: true, message: "Requerido" }]}
            >
              <Select>
                <Select.Option value="house">🏠 Casa</Select.Option>
                <Select.Option value="apartment">🏢 Departamento</Select.Option>
                <Select.Option value="office">🏪 Oficina</Select.Option>
                <Select.Option value="lot">🌳 Lote/Terreno</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Subtipo" name="subtype">
              <Select placeholder="Selecciona un subtipo" allowClear>
                <Select.Option value="standard">Standard</Select.Option>
                <Select.Option value="penthouse">Penthouse</Select.Option>
                <Select.Option value="single_family">Casa Unifamiliar</Select.Option>
                <Select.Option value="townhouse">Townhouse</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Estado" name="status">
              <Select>
                <Select.Option value="available">Disponible</Select.Option>
                <Select.Option value="reserved">Reservada</Select.Option>
                <Select.Option value="sold">Vendida</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Condición" name="property_condition">
              <Select>
                <Select.Option value="new">Nueva</Select.Option>
                <Select.Option value="resale">Reventa</Select.Option>
                <Select.Option value="under_construction">En Construcción</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Tipo de Operación" name="operation_type">
              <Select>
                <Select.Option value="sale">Venta</Select.Option>
                <Select.Option value="rent">Renta</Select.Option>
                <Select.Option value="both">Ambos</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Columna Derecha */}
          <Col span={12}>
            <h3>💰 Precio y Características</h3>
            
            <Form.Item
              label="Precio (MXN)"
              name="price"
              rules={[{ required: true, message: "Requerido" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Recámaras" name="bedrooms">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Baños" name="bathrooms">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Medios Baños" name="half_bathrooms">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Estacionamientos" name="parking_spots">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <h3>📐 Áreas (m²)</h3>
            
            <Form.Item
              label="Área Total"
              name={["area", "total"]}
              rules={[{ required: true, message: "Requerido" }]}
            >
              <InputNumber 
                min={0} 
                step={0.01}
                style={{ width: "100%" }}
                addonAfter="m²"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Área Interior" name={["area", "interior"]}>
                  <InputNumber 
                    min={0} 
                    step={0.01}
                    style={{ width: "100%" }}
                    addonAfter="m²"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Terraza" name={["area", "terrace"]}>
                  <InputNumber 
                    min={0} 
                    step={0.01}
                    style={{ width: "100%" }}
                    addonAfter="m²"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <h3>📍 Ubicación</h3>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="Desarrollo"
              name={["location", "development"]}
              rules={[{ required: true, message: "Requerido" }]}
            >
              <Input placeholder="ej: Blue Tower" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Ciudad"
              name={["location", "city"]}
              rules={[{ required: true, message: "Requerido" }]}
            >
              <Input placeholder="ej: Huixquilucan" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Estado" name={["location", "state"]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Colonia/Zona" name={["location", "neighborhood"]}>
              <Input placeholder="ej: Bosque Real" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Dirección Completa" name="address">
              <Input placeholder="Dirección completa de la propiedad" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <h3>📝 Descripción</h3>
            <Form.Item name="description">
              <Input.TextArea
                rows={4}
                placeholder="Descripción detallada de la propiedad..."
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <h3>🖼️ Imágenes y Multimedia</h3>

            <Form.Item
              label="URLs de Imágenes"
              name="images"
              help="Ingresa una URL por línea. Las imágenes se mostrarán en el orden ingresado."
            >
              <Input.TextArea
                rows={5}
                placeholder="https://res.cloudinary.com/imagen1.jpg&#10;https://res.cloudinary.com/imagen2.jpg&#10;https://res.cloudinary.com/imagen3.jpg"
              />
            </Form.Item>

            <Form.Item
              label="Recorrido Virtual (URL)"
              name="virtual_tour"
              help="URL del recorrido virtual 360° o video tour de la propiedad"
            >
              <Input
                placeholder="https://ejemplo.com/tour-virtual"
                addonBefore="🎥"
              />
            </Form.Item>

            <Form.Item
              label="Ficha Técnica (URL)"
              name="technical_sheet_url"
              help="URL del PDF de la ficha técnica (Google Drive, Dropbox, etc.)"
            >
              <Input
                placeholder="https://drive.google.com/file/d/..."
                addonBefore="📄"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <h3>✨ Amenidades</h3>

            <Form.Item
              label="Amenidades"
              name="amenities"
              help="Ingresa una amenidad por línea. Ej: Alberca, Gimnasio, Seguridad 24/7"
            >
              <Input.TextArea
                rows={5}
                placeholder="Alberca&#10;Gimnasio&#10;Área de juegos infantiles&#10;Seguridad 24/7&#10;Salón de eventos"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <h3>📐 Planos y Ubicación</h3>

            <Form.Item
              label="URLs de Planos"
              name="floor_plans"
              help="Ingresa una URL por línea. Ej: planos arquitectónicos, distribución, etc."
            >
              <Input.TextArea
                rows={4}
                placeholder="https://res.cloudinary.com/plano-nivel1.jpg&#10;https://res.cloudinary.com/plano-nivel2.jpg"
              />
            </Form.Item>

            <Form.Item
              label="URL de Mapa (Embed)"
              name="map_embed_url"
              help="URL del iframe de Google Maps o similar"
            >
              <Input
                placeholder="https://www.google.com/maps/embed?pb=..."
                addonBefore="🗺️"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Latitud"
                  name="latitude"
                  help="Coordenada de latitud (ej: 19.432608)"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step={0.000001}
                    precision={8}
                    placeholder="19.432608"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Longitud"
                  name="longitude"
                  help="Coordenada de longitud (ej: -99.133209)"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step={0.000001}
                    precision={8}
                    placeholder="-99.133209"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Propiedad Destacada"
              name="featured"
              valuePropName="checked"
            >
              <Switch checkedChildren="Sí" unCheckedChildren="No" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Acepta Mascotas"
              name="pet_friendly"
              valuePropName="checked"
              help="Si está desactivado, se mostrará 'No acepta mascotas'"
            >
              <Switch checkedChildren="Sí" unCheckedChildren="No" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Publicada"
              name="published"
              valuePropName="checked"
            >
              <Switch checkedChildren="Sí" unCheckedChildren="No" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}