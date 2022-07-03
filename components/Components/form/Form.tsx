import { faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Category, Featured, IMark, Item, Section } from "../../../src/interfaces";
import { Product } from "../../../src/interfaces/HomeAppliance";
{
  
}
type FormData = Omit<Product, 'slug'| 'site' | 'status' | 'client'>
// interface FormData {
//   _id?: string;
//   name: string;
//   brand: string;
//   image: string[];
//   description: string;
//   category: string;
//   section: string;
//   item: string;
//   inStock: number;
//   price: number;
//   oldPrice: number;
//   tags: string[];
//   featured: string;

//   color: string;
//   sizes: string[];
// }
interface Props {
  product: FormData
}
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export const Form: FC<Props> = ({ product }) => {
  // console.log(product)

  const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
    defaultValues: { ...product }
  })

  const [brand, setBrand] = useState([]);
  const [brandHref, setBrandHref] = useState('');

  const [category, setCategory] = useState([]);
  const [categoryHref, setCategoryHref] = useState('');
  const [section, setSection] = useState([]);
  const [sectionHref, setSectionHref] = useState('');
  const [item, setItem] = useState([]);
  const [itemHref, setItemHref] = useState('');
  const [featured, setFeatured] = useState([]);
  const [featuredHref, setFeaturedHref] = useState('');

  // console.log('featured', featured)
  // console.log(section)
  // console.log(brand)
  // console.log(categoryHref)
  // console.log(sectionHref)

  useEffect(() => {
    if (product._id) {

      setBrandHref(product.brand);
      setCategoryHref(product.category);
      setSectionHref(product.section);
      setFeaturedHref(product.featured);
    }
  }, [])

  const handleBrand = (event: ChangeEvent<HTMLSelectElement>) => {
    const getBrandHref = event.target.value;
    setValue('brand', getBrandHref, { shouldValidate: true })
    setBrandHref(getBrandHref);
  }

  useEffect(() => {
    const getBrand = async () => {
      const resp = await fetch(`${process.env.APIP_URL}/api/marks`)
        .then(res => res.json())
      const res = resp.filter((d: { site: string; }) => d.site === `${process.env.API_SITE}`)
      const re = res.map((data: { href: IMark; }): IMark => data.href)
      setBrand(re)
    }
    getBrand();
  }, []);
  // console.log(brand)
  useEffect(() => {
    const getcategory = async () => {
      fetch(`${process.env.APIS_URL}/api/site/${process.env.API_SITE}`)
        .then(res => res.json())
        .then(data => {
          setCategory(data.categories.map((data: { href: Category; }): Category => data.href))
        })
    }
    getcategory();
  }, []);

  const handleCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    const getCategoryHref = event.target.value;
    setValue('category', getCategoryHref, { shouldValidate: true })
    setCategoryHref(getCategoryHref);
  }

  useEffect(() => {
    const getSection = async () => {
      const resp = await fetch(`${process.env.APIS_URL}/api/site/${process.env.API_SITE}`)
        .then(res => res.json())
      const res = resp?.categories.find((data: { href: string; }) => data.href === `${categoryHref}`)
      const re = res?.sections.map((data: { href: Section; }): Section => data.href)
      setSection(re)
    }
    getSection();
  }, [categoryHref]);

  useEffect(() => {
    const getFeatured = async () => {
      const resp = await fetch(`${process.env.APIS_URL}/api/site/${process.env.API_SITE}`)
        .then(res => res.json())
      const res = resp?.categories.find((data: { href: string; }) => data.href === `${categoryHref}`)
      const re = res?.featured.map((data: { href: Featured; }): Featured => data.href)
      setFeatured(re)
    }
    getFeatured();
  }, [categoryHref]);

  const handleFeatured = (event: ChangeEvent<HTMLSelectElement>) => {
    const getFeaturedHref = event.target.value;
    setFeaturedHref(getFeaturedHref);
    setValue('featured', getFeaturedHref, { shouldValidate: true })
  }

  const handleSection = (event: ChangeEvent<HTMLSelectElement>) => {
    const getSectionHref = event.target.value;
    setSectionHref(getSectionHref);
    setValue('section', getSectionHref, { shouldValidate: true })
  }

  useEffect(() => {
    const getItem = async () => {
      const resp = await fetch(`${process.env.APIS_URL}/api/site/${process.env.API_SITE}`)
        .then(res => res.json())
      const res = resp?.categories.find((data: { href: string; }) => data.href === `${categoryHref}`)
      const re = res?.sections.find((data: { href: string; }) => data.href === `${sectionHref}`)
      const r = re?.items.map((data: { href: Item; }): Item => data.href)
      setItem(r)
    }
    getItem();
  }, [sectionHref]);

  const handleItem = (event: ChangeEvent<HTMLSelectElement>) => {
    const getItemHref = event.target.value;
    // setItemnHref(getItemHref);
    setValue('item', getItemHref, { shouldValidate: true })

  }


  const router = useRouter()
  const [newTagValue, setNewTagValue] = useState('')



  const onNewTag = () => {

    const newTag = newTagValue.trim().toLocaleLowerCase();
    setNewTagValue('');
    const currentTags = getValues('tags');
    if (currentTags.includes(newTag)) {
      return;
    }
    currentTags.push(newTag);
  }
  const onDeleteTag = (tag: string) => {
    const updatedTags = getValues('tags').filter(t => t !== tag);
    setValue('tags', updatedTags, { shouldValidate: true })
  }

  const onDeleteImage = async (image: string) => {
    setValue('image', getValues('image').filter(img => img !== image), { shouldValidate: true })
    const fileExtension = image.substring(image.lastIndexOf('/') + 1).split('.').slice(0, -1).join('.')
    await axios.patch(`${process.env.APIUP_URL}/api/upload/${fileExtension}`)

  }

  const onSubmit = async (form: FormData) => {
    const data = { ...form, name: form.name.trim(), price: Number(form.price), oldPrice: Number(form.oldPrice), inStock: Number(form.inStock), site: process.env.API_SITE }
    if (form._id) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Producto Actualizado',
        showConfirmButton: false,
        timer: 1500
      })
      await axios.put(`${process.env.APIP_URL}/api/glasses/${product._id}`, data)
      router.replace('/admin')

    } else {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Producto Creado',
        showConfirmButton: false,
        timer: 1500
      })
      await axios.post(
        `${process.env.APIP_URL}/api/glasses`, data);
      router.replace(`/admin`)
    }
  }

  const onFileSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }
    try {
      for (const file of target.files) {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await axios.post(`${process.env.APIUP_URL}/api/upload/image`, formData)
        setValue('image', [...getValues('image'), data.url], { shouldValidate: true })
      }
    } catch (error) {
      console.log({ error })
    }
  }


  const [tags, setTags] = useState([
    { id: 'Thailand', text: 'Thailand' },
    { id: 'India', text: 'India' },
    { id: 'Vietnam', text: 'Vietnam' },
    { id: 'Turkey', text: 'Turkey' }
  ]);

  const handleDelete = (i: number) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag: { id: string; text: string; }) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag: { id: string; text: string; }, currPos: number, newPos: number) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = (index: number) => {
    console.log('The tag at index ' + index + ' was clicked');
  };
  return (
    <>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto lg:max-w-none mb-3">

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="sm:shadow sm:rounded-md sm:overflow-hidden">
                <div className="sm:p-6">

                  <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
                    <div className="col-span-2 grid grid-cols-6 gap-3 sm:gap-6 ">
                      <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="name" className="block text-xs lg:text-sm font-medium text-gray-700">
                          Nombre
                        </label>
                        <input
                          className="mt-1 focus:ring-rose-500 focus:border-rose-500 block w-full shadow-sm text-xs lg:text-sm  rounded-md  py-2 px-3 border border-gray-300"
                          type={"text"}
                          {...register('name', {
                            onChange: (e) => { },
                            onBlur: (e) => { },
                            required: 'Este campo es requerido',
                            minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                          })}
                        />
                        <div>
                          {errors.name && <span className="text-xs lg:text-sm text-rose-500">{errors.name.message}</span>}
                        </div>
                      </div>

                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="brand" className="block text-xs lg:text-sm font-medium text-gray-700">
                          Marca
                        </label>
                        <select
                          className="mt-1  block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 text-xs lg:text-sm capitalize"
                          {...register('brand', {
                            required: 'Este campo es requerido',
                          })}
                          onChange={(e) => handleBrand(e)}
                          value={getValues('brand')}
                        >
                          <option value="" >--Seleccionar--</option>
                          {
                            brand?.map((data: string, i: number) => (
                              <option
                                className="capitalize"
                                key={i}
                              >{data}</option>
                            ))
                          }
                        </select>
                        <div>
                          {errors.brand && <span className="text-xs lg:text-sm text-rose-500">{errors.brand.message}</span>}
                        </div>
                      </div>

                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="category" className="block text-xs lg:text-sm font-medium text-gray-700">
                          Categoría
                        </label>
                        <select
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 text-xs lg:text-sm capitalize"
                          {...register('category', {
                            required: 'Este campo es requerido',
                          })}
                          onChange={(e) => handleCategory(e)}
                          value={getValues('category')}
                        >
                          <option value="">--Seleccionar--</option>
                          {
                            category?.map((data: string, i: number) => (
                              <option
                                className="capitalize"
                                key={i}
                              >{data}</option>
                            ))
                          }
                        </select>
                        <div>
                          {errors.category && <span className="text-xs lg:text-sm text-rose-500">{errors.category.message}</span>}
                        </div>
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="section" className="block text-xs lg:text-sm font-medium text-gray-700">
                          Sección
                        </label>
                        <select
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 text-xs lg:text-sm capitalize"
                          {...register('section', {
                            required: 'Este campo es requerido',
                          })}
                          onChange={(e) => handleSection(e)}
                          value={getValues('section')}


                        >
                          <option value="">--Seleccionar--</option>
                          {
                            section?.map((data, i) => (

                              <option key={i} className="capitalize">{data}</option>
                            ))
                          }
                        </select>
                        <div>
                          {errors.category && <span className="text-xs lg:text-sm text-rose-500">{errors.category.message}</span>}
                        </div>
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="item" className="block text-xs lg:text-sm font-medium text-gray-700">
                          Item
                        </label>
                        <select
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 text-xs lg:text-sm capitalize"
                          {...register('item', {
                            required: 'Este campo es requerido',
                          })}
                          onChange={(e) => handleItem(e)}
                          value={getValues('item')}


                        >
                          <option value="">--Seleccionar--</option>
                          {
                            item?.map((data, i) => (

                              <option key={i} className="capitalize">{data}</option>
                            ))
                          }
                        </select>
                        <div>
                          {errors.item && <span className="text-xs lg:text-sm text-rose-500">{errors.item.message}</span>}
                        </div>
                      </div>

                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="inStock" className="block text-xs lg:text-sm font-medium text-gray-700">
                          Inventario
                        </label>
                        <input
                          className="mt-1 focus:ring-rose-500 focus:border-rose-500 block w-full shadow-sm text-xs lg:text-sm border border-gray-300 rounded-md  py-2 px-3"
                          type='number'
                          {...register('inStock', {
                            required: 'Este campo es requerido',
                            min: { value: 0, message: 'Mínimo de valor cero' }
                          })}
                        />
                        <div>
                          {errors.inStock && <span className="text-xs lg:text-sm text-rose-500">{errors.inStock.message}</span>}
                        </div>
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="price" className="block text-xs lg:text-sm font-medium text-gray-700">
                          Precio[Bs]
                        </label>
                        <input
                          className="mt-1 focus:ring-rose-500 focus:border-rose-500 block w-full shadow-sm text-xs lg:text-sm border border-gray-300 rounded-md  py-2 px-3"
                          type='number'
                          {...register('price', {
                            required: 'Este campo es requerido',
                            min: { value: 0, message: 'Mínimo de valor cero' }
                          })}
                        />
                        <div>
                          {errors.price && <span className="text-xs lg:text-sm text-rose-500">{errors.price.message}</span>}
                        </div>
                      </div>

                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="oldPrice" className="block text-xs lg:text-sm font-medium text-gray-700">
                          Precio de descuento[Bs]
                        </label>
                        <input
                          type='number'
                          className="mt-1 focus:ring-rose-500 focus:border-rose-500 block w-full shadow-sm text-xs lg:text-sm border border-gray-300 rounded-md  py-2 px-3"
                          {...register('oldPrice', {
                            required: 'Este campo es requerido',
                            min: { value: 0, message: 'Mínimo de valor cero' }
                          })}
                        />
                        <div>
                          {errors.oldPrice && <span className="text-xs lg:text-sm text-rose-500">{errors.oldPrice.message}</span>}
                        </div>
                      </div>

                      <div className="col-span-6">
                        <label htmlFor="description" className="block text-xs lg:text-sm font-medium text-gray-700">
                          Descripción
                        </label>
                        <div className="">
                          <textarea
                            rows={4}
                            className="mt-1 shadow-sm focus:ring-rose-500 focus:border-rose-500 block w-full text-xs lg:text-sm border border-gray-300 rounded-md  py-2 px-3"
                            {...register('description', {
                              required: 'Este campo es requerido',
                              minLength: { value: 2, message: 'Mínimo 3 caracteres' }
                            })}
                          />
                        </div>
                        <div>
                          {errors.description && <span className="text-xs lg:text-sm text-rose-500">{errors.description.message}</span>}
                        </div>
                      </div>

                      {/* <div className="col-span-6 sm:col-span-2">
                        <fieldset
                        >
                          <legend className="contents text-xs lg:text-sm font-medium text-gray-900">Tallas</legend>
                          <div className="grid grid-cols-4 sm:grid-cols-3 gap-2 mt-4 ">
                            {
                              validSizes.map((data, i) => (
                                <div className="flex items-center" key={i}>

                                  <input
                                    type="checkbox"
                                    value={data}
                                    className="focus:ring-rose-500 h-4 w-4 text-rose-500 border-gray-300 text-xs lg:text-sm"
                                    {...register('sizes', {
                                      required: {
                                        value: true,
                                        message: 'size is required'
                                      },
                                    })}
                                  />
                                  <label htmlFor="sizes" className="ml-3 block text-xs lg:text-sm font-medium text-gray-700">
                                    {data}
                                  </label>
                                </div>
                              ))
                            }
                          </div>
                        </fieldset>
                        <div>
                          {errors.sizes && <span className="text-xs lg:text-sm text-rose-500">seleccione al menos una talla</span>}
                        </div>
                      </div> */}

                      <div className="col-span-6 sm:col-span-2">
                        <div>
                          <label htmlFor="tags" className="block text-xs lg:text-sm font-medium text-gray-700">
                            Tags
                          </label>
                          <input
                            className="mt-2 py-2 px-3 focus:ring-rose-500 focus:border-rose-500 block w-full shadow-sm text-xs lg:text-sm border border-gray-300 rounded-md p-1"
                            type={"text"}
                            value={newTagValue}
                            onChange={({ target }) => setNewTagValue(target.value)}
                            onKeyUp={({ code, key }) =>
                              code === 'Enter' ? onNewTag() : code === 'Space' ? onNewTag() : undefined
                            }

                          />
                          <p className="mt-2 text-xs lg:text-sm text-gray-500 hidden lg:block mb-2">
                            Presiona [Spacio] para agregar.
                          </p>
                          <p className="mt-2 text-xs lg:text-sm text-gray-500 lg:hidden mb-2">
                            Presiona [Enter] para agregar.
                          </p>

                        </div>
                        <div className="col-span-6 sm:col-span-2 border py-2 px-3 border-gray-300 rounded-md h-20 overflow-y-auto">

                          <div className="grid grid-cols-2 gap-2 "  >
                            {
                              getValues('tags').map((data, i) => (
                                <p key={i} className="flex items-center text-xs lg:text-sm">{data}
                                  <FontAwesomeIcon
                                    className="text-xs lg:text-sm leading-none mx-1 text-gray-600 hover:text-gray-900 rounded focus:outline-none "
                                    onClick={() => onDeleteTag(data)}
                                    icon={faCircleMinus}
                                  />
                                </p>
                              ))
                            }
                          </div>

                        </div>

                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="featured" className="block text-xs lg:text-sm font-medium text-gray-700">
                          Destacados
                        </label>
                        <select
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 text-xs lg:text-sm capitalize"
                          {...register('featured')}
                          onChange={(e) => handleFeatured(e)}
                          value={getValues('featured')}


                        >
                          <option value="ninguno">--Seleccionar--</option>
                          {
                            featured?.map((data, i) => (

                              <option key={i} className="capitalize text-xs lg:text-sm">{data}</option>
                            ))
                          }
                        </select>
                        <div>
                          {errors.featured && <span className="text-xs lg:text-sm text-rose-500">{errors.featured.message}</span>}
                        </div>
                      </div>
                      {/* <div className="col-span-6 sm:col-span-2">
                        <fieldset>
                          <legend className="text-base font-medium text-gray-900">Promociones</legend>
                          {/* <p className="text-xs lg:text-sm text-gray-500">elige una opción:</p> 
                          <div className="mt-4 space-y-4">
                            {
                              validFeatured.map((data, i) => (
                                <div key={i} className="flex items-center">
                                  <input
                                    type="radio"
                                    value={data}
                                    className="focus:ring-rose-500 h-4 w-4 text-rose-500 border-gray-300"
                                    {...register('featured')}
                                  />
                                  <label htmlFor="featured" className="ml-3 block text-xs lg:text-sm font-medium text-gray-700">
                                    {data}
                                  </label>
                                  
                                </div>
                              ))
                            }


                          </div>
                        </fieldset>
                        
                      </div> */}

                    </div>

                    <div className="col-span-1 mt-3 sm:mt-0">
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Imagen</label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-center p-2 border-2 border-gray-300 border-dashed rounded-md">
                          <div className=" text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex flex-col text-xs lg:text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-rose-500 hover:text-rose-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-rose-500"
                              >
                                <span>Cargar un archivo</span>
                                <input id="file-upload" name="file-upload" accept="image/png, image/gif, image/jpeg, image/webp" multiple type="file"  className="sr-only" onChange={onFileSelected} />
                              </label>
                              <p className="pl-1">o arrastrar y soltar</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2" >
                          {
                            getValues('image').map((data, i) => (
                              <div key={i} className="relative border-2">
                                <Image
                                  src={data}
                                  alt="image"
                                  height={200}
                                  width={200}
                                  objectFit="contain"
                                // className="object-center object-cover"
                                />
                                <FontAwesomeIcon
                                  className="text-xs lg:text-sm leading-none mx-1 text-gray-600 hover:text-gray-900 rounded focus:outline-none absolute bottom-1 right-1"
                                  onClick={() => onDeleteImage(data)}
                                  icon={faCircleMinus}
                                />
                              </div>
                            ))
                          }
                        </div>
                        <div className="flex items-center">
                          {/* <div className=" rounded-lg overflow-hidden leading-none">
                              <Image
                                src={getValues('imageSrc')}
                                alt="image"
                                height={300}
                                width={300}
                                objectFit="cover"
                              />
                            </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" bg-white text-right mt-3">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs lg:text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                    >
                      {
                        product._id ? `Actualizar` : `Crear`
                      }
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>


    </>
  )
}
