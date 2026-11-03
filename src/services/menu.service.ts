import APIBase from './httpBase'
import type { Menu, Product, PublicSettings } from '@/types'

class MenuService extends APIBase {
  async getMenu(): Promise<Menu> {
    return (await this.get<Menu>('menu')).data
  }

  async getProduct(slug: string): Promise<{ product: Product; related: Product[] }> {
    return (await this.get<{ product: Product; related: Product[] }>(`menu/products/${slug}`)).data
  }

  async getSettings(): Promise<PublicSettings> {
    return (await this.get<PublicSettings>('settings')).data
  }
}

export const menuService = new MenuService()
