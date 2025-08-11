'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const addressFormSchema = z.object({
  recipientName: z
    .string()
    .min(2, 'Nome do destinatário deve ter pelo menos 2 caracteres'),
  street: z.string().min(5, 'Logradouro deve ter pelo menos 5 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres'),
  zipCode: z
    .string()
    .min(1, 'CEP é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 8, 'CEP deve ter 8 dígitos'),
  country: z.string().min(2, 'País é obrigatório'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .refine(
      (val) => val.length >= 10 && val.length <= 11,
      'Telefone deve ter 10 ou 11 dígitos',
    ),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

// Função para buscar endereço por CEP
async function fetchAddressByCep(cep: string) {
  try {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return null;

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (data.erro) return null;

    return {
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
}

export const Addresses = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      recipientName: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Brasil',
      phone: '',
    },
  });

  async function onSubmit(values: AddressFormValues) {
    try {
      console.log('Address form values:', values);
      // TODO: Implementar a lógica para salvar o endereço
      toast.success('Endereço salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar endereço. Tente novamente.');
      console.error('Error saving address:', error);
    }
  }

  // Função para buscar endereço automaticamente quando CEP for preenchido
  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      const addressData = await fetchAddressByCep(cep);

      if (addressData) {
        form.setValue('street', addressData.street);
        form.setValue('neighborhood', addressData.neighborhood);
        form.setValue('city', addressData.city);
        form.setValue('state', addressData.state);
        toast.success('Endereço encontrado!');
      } else {
        toast.error('CEP não encontrado');
      }
      setIsLoadingCep(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Addresses</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
          <Card>
            <CardContent>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add_new" id="add_new" />
                <Label htmlFor="add_new">Add Address</Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

        {selectedAddress === 'add_new' && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">New Address</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <PatternFormat
                                format="#####-###"
                                placeholder="00000-000"
                                customInput={Input}
                                value={field.value}
                                onValueChange={(values) => {
                                  field.onChange(values.formattedValue);
                                  if (
                                    values.value &&
                                    values.value.length === 8
                                  ) {
                                    handleCepChange(values.formattedValue);
                                  }
                                }}
                              />
                              {isLoadingCep && (
                                <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua das Flores" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="complement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complement</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Apto 101 (opcional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Neighborhood</FormLabel>
                          <FormControl>
                            <Input placeholder="Centro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="São Paulo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="SP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <PatternFormat
                              format="(##) #####-####"
                              placeholder="(11) 99999-9999"
                              customInput={Input}
                              value={field.value}
                              onValueChange={(values) => {
                                field.onChange(values.formattedValue);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recipientName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Recipient Name</FormLabel>
                          <FormControl>
                            <Input placeholder="João Silva" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" className="w-full md:w-auto">
                      Save Address
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
