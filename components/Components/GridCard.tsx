import { useRouter } from "next/router"
import { FC } from "react"
import { Category, Item, Section } from "../../src/interfaces"
import { CardComponent } from "./CardComponent"
import { IClothing } from '../../src/interfaces/Clothing';

interface GridCard {
  data?: Section[] | Category[] |  Item[]
  sections?: Section[]
  categories?: Category[]
  items?: Item[]
  category?: string
  product?: IClothing[]
}

export const GridCard: FC<GridCard> = ({sections, category, data, product}) => {
  const router = useRouter();
  // console.log(router.query)
  // console.log(router.query.category)
  // console.log(router.query.section)
  // console.log(router.query.item)

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <div 
          className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {
              router.query.item 
              ?
                <>
                  {product?.map((fact,i) => (
                    <CardComponent 
                      key={i}
                      name={fact.name} 
                      imageSrc={fact.image[0]} 
                      imageAlt={fact.name} 
                      description={fact.description} 
                      width={500}
                      height={600} 
                      objectFit='cover'
                      href={`/detalles/${fact.slug}`}
                      price={fact.price}
                    />
                  ))}
                  </>
              :
              <>
              {data?.map((fact,i) => (
                <CardComponent 
                  key={i}
                  name={fact.name} 
                  imageSrc={fact.imageSrc} 
                  imageAlt={fact.imageAlt} 
                  description={fact.description} 
                  width={500}
                  height={600} 
                  objectFit='cover'
                  href={
                    // router.query.item ? `/detalles/${fact.slug}` 
                    // : 
                    router.query.section ? `/${router.query.category}/${router.query.section}/${fact.href}` 
                    : 
                    router.query.category ? `/${router.query.category}/${fact.href}` : ''
                  }
                />
              ))}
              </>
              
            }
            
          </div>
        </div>
      </div>
    </div>
  )
}
